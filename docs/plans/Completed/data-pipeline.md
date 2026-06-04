# Data Pipeline: Sourcing → Verification → Publication

A repeatable pipeline for ingesting election data, collecting candidate sources, building profiles, and verifying every claim — independent of the DDD data model or site tech stack. Designed to be rerun for any election cycle or jurisdiction.

## Overview

The pipeline has six stages. Each feeds the next:

```
Sourcing → Candidate Discovery → Source Collection → Profile Building → Verification → Publication
```

Stages may partially overlap (a later stage can begin while earlier ones continue for other races), but no stage is complete until all its runs pass for the current election.

No stage depends on the site's data model or Eleventy templates. The pipeline produces verified, attributed content — and the site consumes that output.

## Stage 1: Election Sourcing

Discover and compile the official election structure from government sources.

### Inputs

- Maine Secretary of State elections page: <https://www.maine.gov/sos/elections-voting>
- City/town clerk website for local elections
- Previous cycle's candidate filings (for office context, term lengths)

### Process

1. **Identify the election event**: type (primary/general/special), date, jurisdiction scope
2. **Locate the certified candidate list** by party and office — download PDF or scrape tables
3. **Locate ballot questions** — certified question text, legislative history (if legislative referendum), fiscal impact statements
4. **Locate polling locations and precincts** — SoS voting place report, city clerk precinct maps
5. **Identify key deadlines** — registration deadline, absentee request deadline, early voting period
6. **Source each finding** — record the exact URL, access date, and page title for every piece of official data

### Outputs

A structured election manifest listing:

- Election metadata (date, type, jurisdiction)
- Each race: office, party, candidate names as listed by the official source
- Each ballot question: title, full text, certified date
- Key dates with official source citations
- Polling location mapping by precinct

### Integrity checks

- Candidate list matches across all official sources (SOS + city clerk)
- All ballot questions have certified language (not draft language)
- Key dates fall within statutory windows (ME Title 21-A)
- Every official data point has a URL and access date recorded

### Tooling

- Web browser for manual navigation of government sites
- PDF extraction (markitdown, or grep -o for simple tables)
- Source document snapshots saved to `.agents/search-snapshots/raw/` per swain-search snapshot protocol

---

## Stage 2: Candidate Discovery

Identify every candidate in every race and their public-facing information.

### Inputs

- Stage 1 output (certified candidate list)
- Campaign finance filings (if available, for candidate contact info)
- Party websites

### Process

1. **For each candidate name** from Stage 1, search for:
   - Campaign website (Google: `"Full Name" campaign` or `"Full Name" for [office]`)
   - Ballotpedia profile
   - Official social media accounts (campaign, not personal)
   - Campaign finance registration (Maine Ethics Commission)
2. **Verify identity**: confirm the person found is the same person on the certified candidate list
3. **Record candidate metadata**: name as filed, campaign website URL, occupation, residence (if disclosed), incumbent status
4. **For incumbents**: note previous term history, committee assignments, voting record availability

### Outputs

- Candidate manifest: one entry per candidate with verified name, campaign URLs, party, office sought, incumbent flag

### Integrity checks

- Every candidate on the certified list has at least a campaign website or Ballotpedia entry
- No misattribution (common names verified against jurisdiction)
- Campaign website confirmed active (200 response) on discovery date

### Tooling

- Web search (Brave Search API)
- Ballotpedia API or crawl
- Maine Ethics Commission campaign finance portal
- `swain-search` for trove creation per race

---

## Stage 3: Source Collection

Ingest every primary and secondary source for each candidate and ballot question.

### Inputs

- Stage 2 output (candidate manifest with URLs)
- Stage 1 output (ballot question text, official links)

### Source types

| Type | Examples | Priority |
|------|----------|----------|
| Campaign website | Platform/issues page, about page | Primary |
| Candidate questionnaire | VOTE411, LWV forum responses | Primary |
| Debate footage | YouTube, WMTW, Maine Public | Primary |
| Campaign ad | TV/radio ad, mailer | Primary |
| News profile | Maine Public "Your Vote 2026" series | Secondary |
| News reporting | Coverage of campaign events, controversy | Secondary |
| Editorial/endorsement | Newspaper endorsement, org endorsement lists | Tertiary |
| Social media | Campaign Twitter/X, Facebook | Tertiary |

### Process

For each source:

1. **Collect URL** — from search, candidate site, news aggregator
2. **Snapshot** — export raw content via swain-search snapshot protocol to `.agents/search-snapshots/raw/`
3. **Normalize** — convert to structured markdown
4. **Tag** — race, candidate, issue area(s), source type, date
5. **Summarize** — write 1-3 sentence summary of what the source covers and its relevance
6. **Log metadata** — URL, access date, content hash, source type, paywall status

### Source coverage target

- At least 1 primary source per candidate covering their platform (campaign website or VOTE411)
- All debate footage for competitive races
- At least 2 independent news sources per controversy or contested claim
- Paywalled sources: use proxy fallback from swain-search; if proxy fails, note as paywalled and find alternative

### Integrity checks

- Every source URL has been snapshotted (not just bookmarked)
- Content hash recorded for change detection on refresh
- No duplicate source ingestion (same URL ingested once)
- Paywall status flagged in metadata

### Tooling

- `swain-search` scripts: `export-snapshot.sh`, `resolve-proxy.sh`, `verify-snapshot-evidence.sh`
- `media-summary` skill for YouTube debates, podcasts, video ads
- Web browser for scripting/interactive collection
- `rk` (research-keeper CLI) for source management (not required — sources can be tracked by manifest alone)

---

## Stage 4: Profile Building

From collected sources, build structured candidate and race profiles.

### Inputs

- Stage 3 output (normalized source documents)
- Stage 1 output (race structure, offices)

### Process

1. **For each candidate**, extract from sources:
   - Stated positions per issue area — using candidate's own words or neutral paraphrase
   - Background, occupation, residence, endorsements
   - Campaign contact info, social media
2. **For each race**, compile:
   - Context (why this race matters, what's at stake)
   - Voting rules (primary only, RCV, write-in)
   - Cross-party preview (who the eventual general election opponent would be)
3. **For each ballot question**, compile:
   - Plain-language explanation
   - Fiscal impact in dollar terms
   - Who supports / who opposes (attributed)
   - Jurisdictional scope and voting rules
4. **Source every claim**: every position, every statement, every data point must reference which source(s) support it

### Profile structure per source

```yaml
# Every claim references its source:
position:
  issue: state-budget
  text: "Proposed cutting $4 billion from education funding"
  sourceIds:
    - maine-morning-star-gop-debate-may-5
    - campaign-website-jackson-issues
```

### Integrity checks

- Every claim has a non-empty `sourceIds[]`
- Every `sourceId` resolves to a registered source with non-empty `summary`
- No un-sourced editorializing
- Balanced coverage across all candidates in a race (roughly equal position count)
- Positions use candidate's own words or neutral paraphrase — never editorial framing
- Primary sources preferred over secondary for factual claims
- No Wikipedia as sole source for any claim

### Tooling

- Agent (model-driven) for extracting positions from normalized source documents
- Structured data files for output (YAML/JS/JSON — format determined by site consumption)
- Summary field populated during this stage

---

## Stage 5: Verification

Multi-layered verification of every data point before publication.

### Layer 1: Mechanical checks (automated, run on every change)

| Check | What it catches | Tool |
|-------|----------------|------|
| URL liveness | Every source URL resolves (200) | `.githooks/pre-commit` — playwright-cli |
| Source integrity | Every `sourceId` resolves, every source has summary | Custom script |
| FK integrity | No orphan references across data | Custom validation script |
| Content hash drift | A source's content has changed since snapshot | SHA-256 re-comparison |
| URL pattern consistency | No malformed URLs, no protocol-relative URLs | Regex check |

These run in the pre-commit hook and in CI/CD. If any fail, the build fails.

### Layer 2: Structural checks (automated, per-stage)

| Stage | Check | Failure threshold |
|-------|-------|-------------------|
| 1 | Every race has an official source URL | 0 allowed |
| 2 | Every candidate has campaign website or Ballotpedia | Warning allowed (third-party candidates may not) |
| 3 | Every source has `summary` | 0 allowed |
| 3 | Every source has content hash | 0 allowed |
| 4 | Every claim has `sourceIds` | 0 allowed |
| 4 | Position count variance across candidates in same race | < 50% (no candidate gets 3x the coverage of another) |
| 4 | Primary source ratio > 60% per race | Warning if below |

### Layer 3: Fact-checking agent (automated + human review)

A dedicated verification pass against every profile:

1. **Claim extraction**: For every claim in every candidate's profile, extract the claim text and its source reference
2. **Source verification**: For each claim, an agent reads the source and determines:
   - Does the source actually support the claim?
   - Is the paraphrase faithful to the original?
   - Is there context missing that would change interpretation?
   - Is the source current and authoritative?
3. **Discrepancy report**: Claims that fail verification are flagged for human review:
   - `MATCH` — source supports claim as stated
   - `MISMATCH` — source contradicts or doesn't support the claim
   - `MISSING_CONTEXT` — source supports the claim but important context is omitted
   - `OUTDATED` — source superseded by newer information
   - `PRIMARY_AVAILABLE` — claim uses secondary source but primary exists
4. **Resolution**: Flagged claims are either:
   - Corrected (update claim text to match source)
   - Noted (add qualifying context)
   - Removed (if claim cannot be verified)
   - Escalated to human reviewer (if ambiguous)

A claim may not be published until it passes Layer 3 verification (MATCH or MISSING_CONTEXT with context added).

### Layer 4: Human review (on-demand, mandated before publication)

- Full content read-through by a human before first publication
- Spot-check of at least 20% of claims against their sources
- Verification that nonpartisanship safeguards are holding (no editorial framing, equal coverage)
- Sign-off recorded as a git commit message annotation

### Output

- Verification report per race: count of claims by verification status, any flagged items, resolution notes
- For Layer 3: structured discrepancy report showing claim, source, status, and resolution

### Tooling

- Pre-commit hook (`/githooks/pre-commit`)
- Custom validation scripts (CI/CD build step)
- Fact-checking agent (model-driven, using same source documents as input)
- Human review checklist (document in `docs/developer-workflows/content-pipeline.md`)

---

## Stage 6: Publication

Promote verified content to the site data files.

### Process

1. **Final validation**: Run all Layer 1-3 checks one more time on the complete dataset
2. **Data freeze**: No new sources or positions added after freeze timestamp
3. **Build test**: `npm run build` succeeds
4. **Smoke test**: Manually check 5 race pages, 2 ballot question pages, and the home page for rendering issues
5. **Date stamp**: Every page shows `Last updated: [date]`
6. **Deploy**: Push to production

### Post-publication

- Monitor for URL rot: re-check all source URLs weekly
- Watch for source content changes (hash drift): re-snapshot weekly and flag any changes
- Process corrections per the correction policy
- Archive post-election: freeze data, set stale banner

---

## Repeatability

### New election cycle (e.g., November 2026 General)

The full pipeline runs again:

1. Stage 1: Find the new election on SOS + city clerk
2. Stage 2: Discover new candidates
3. Stage 3: Collect new sources (most prior sources are stale)
4. Stage 4: Build new profiles
5. Stage 5: Verify everything
6. Stage 6: Publish

Previous cycle's data is archived but not modified. The pipeline treats each election independently.

### New jurisdiction (e.g., Portland)

The pipeline adapts per jurisdiction:

- Stage 1 targets that city's clerk + county + SOS for that region
- Stage 2 discovers candidates for that jurisdiction's races
- Stage 3-6 proceed identically but per-jurisdiction source manifests

The pipeline does not prescribe the data storage layout — it only defines the workflow.

### Partial reruns (e.g., candidate withdrawal)

A candidate withdrawal mid-cycle triggers a partial rerun:

- Stage 4: Remove or update affected positions (withdrawn candidate's positions marked as "no longer running")
- Stage 2: Verify replacement candidate (if any)
- Stage 3: Collect sources for replacement
- Stage 5: Re-verify affected races
- Stage 6: Republish

No need to rerun Stage 1 (election structure unchanged) or full Stage 2 (most candidates unchanged).

---

## Tooling Inventory

| Tool | Stage | Purpose |
|------|-------|---------|
| Web browser | 1, 2, 3 | Government site navigation, source discovery |
| `swain-search` scripts | 3 | Snapshot, proxy, verify evidence |
| `media-summary` skill | 3 | YouTube/podcast/ad transcription |
| Brave Search API | 2, 3 | Candidate/source discovery |
| Pre-commit hook | 5 | URL liveness check on every commit |
| Custom validation scripts | 5, 6 | Source integrity, FK integrity, balance checks |
| Fact-checking agent | 5 | Claim-to-source verification |
| Git | All | Version control for source manifests, configuration, and audit trail |

---

## Boundaries

This pipeline is explicitly decoupled from:

- **The site data model** (DDD aggregates, entity shapes) — the pipeline produces verified, attributed content in whatever intermediate format makes sense; the site transforms it into its model
- **The static site generator** — the pipeline doesn't care whether the site uses Eleventy, Astro, or hand-written HTML
- **The research library format** — sources can be tracked as a YAML manifest or via `rk`; the pipeline doesn't mandate how they're stored internally, only that they're verifiable

The pipeline ends when verified content is ready for the site to consume. How the site consumes it is out of scope.