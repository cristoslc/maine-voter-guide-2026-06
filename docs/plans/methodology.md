# Plan: METHODOLOGY.md

## What This Document Is
A public-facing methodology statement explaining how this voter guide is researched, written, verified, and maintained. It should give readers confidence in the guide's accuracy and nonpartisanship by showing the process, not just asserting it.

## Why It Exists
- Transparency requirement for a project claiming to be "nonpartisan"
- Gives readers a way to evaluate reliability
- Required by any responsible civic information project
- Useful for onboarding future contributors

## Proposed Structure

### 1. Sourcing Principles
- **Primary sources only** where possible: campaign websites, official government records, candidate questionnaires (e.g., VOTE411), direct speech/video
- **Secondary sources** (news reporting) used for context, controversies, and verification — never as sole source for factual claims
- **No Wikipedia/Wikidata** as primary source for live controversies or voting records
- **Citation density**: every factual claim inline, every source listed at page bottom
- **Date-stamping**: every page shows last-updated date

### 2. Research Pipeline
Describe the actual tools and workflow:

- **candidate-website-crawler**: Python script (`tools/crawl-candidates.py`) that fetches campaign platform pages, extracts text, and diffs for changes. Saves snapshots to `research/snapshots/`.
- **research-keeper (rk)**: CLI tool at `https://github.com/cristoslc/research-keeper/` for ingesting, tagging, and querying sources.
- **media-summary skill**: Automated download/transcription/summarization of YouTube debates, podcasts, news articles. Output goes to `research/media-summaries/`.
- **Upstream project pooling**: 
  - `~/projects/south-portland-school-board-review/`
  - `~/projects/south-portland-school-budget-FY27/`
  - `~/projects/sopo-alpr-awareness/`
- **Web search**: Brave Search API for real-time news; `rk search`/`rk investigate` for querying existing library
- **Manual verification**: All claims checked against at least two independent sources before publication

### 3. Drafting Process
- Each race starts with a **research spike** — focused session collecting sources
- **Structured data entry** into `_data/races.js` following the race→party→candidate→primary/secondary schema
- **Platform positions** extracted from campaign sites/issue pages (not marketing copy)
- **Controversies** require multiple corroborating sources; single-source allegations noted as "according to [source]"
- **Comparison tables** built from normalized issue positions, not candidate rhetoric
- **Peer review**: All pages reviewed for factual accuracy before commit

### 4. Update Cadence

*Cadence is aspirational, not committed. This is an independent research experiment in AI-driven data utilization.*

- **Breaking news** (endorsements, poll releases, debate moments): same-day or next-day update
- **Polling data**: updated within 48 hours of new survey release
- **Full race review**: weekly during active campaign season
- **Post-primary**: immediate update to show general election matchup
- **Archival**: snapshot of each version preserved in git history

### 5. Correction Policy

*Correction policy is aspirational, not committed. This is an independent research experiment in AI-driven data utilization.*

- Errors corrected within 24 hours of report
- Correction notation on affected page with date
- Git history preserves original + corrected version
- Contact method for reporting errors (email/GitHub issue)

### 6. Nonpartisanship Safeguards
- No editorial framing in position descriptions (candidate's own words or neutral paraphrase)
- Equal depth for all candidates in a race (not just frontrunners)
- Opposing viewpoints presented without rebuttal
- No endorsement language, no "should vote for" recommendations
- Controversies section includes candidate response where available

### 7. Limitations
- Research window: May 2026 for June 2026 election — some positions may have evolved
- Information gaps noted explicitly ("No campaign website found as of [date]")
- Not real-time: see VOTE411 for latest candidate questionnaires

## Prior Art to Reference

### Research-Keeper (`https://github.com/cristoslc/research-keeper/`)
- Source ingestion: `rk add <url>` → downloads, tags, extracts text
- Query interface: `rk search "Platner immigration"` → ranked results
- Citation export: generates source lists in markdown
- Versioning: tracks when sources were added/updated

## Sources the Methodology Should Cite as Examples
- [Maine Monitor](https://themainemonitor.org) — local nonprofit news, model for deep-dive single-subject reporting
- [Ballotpedia](https://ballotpedia.org) — encyclopedic candidate/database approach, but we differ by being local and narrative
- [VOTE411](https://www.vote411.org) — candidate questionnaires, direct source
- [Project Vote Smart](https://justfacts.votesmart.org) — voting record aggregation (we use similar legislative lookup)
- Portland Press Herald, Bangor Daily News, Maine Public — regional news baseline

## Affected Files (When Implemented)
- **New**: `METHODOLOGY.md` at project root
- **New**: `ATTRIBUTION.md` at project root (see separate plan)
- **New**: `tools/crawl-candidates.py` (referenced in methodology)
- **New**: `docs/research/` directory for snapshots and summaries

## Acceptance Criteria
- [ ] Document is signed by author(s) with date
- [ ] All sourcing tools and workflows are named and locatable
- [ ] Limitations are honest, not defensive
- [ ] Correction policy includes contact method and SLA
- [ ] References to prior art are specific (project paths, URLs)
