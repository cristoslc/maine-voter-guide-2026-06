# Implementation Plan

Right to left: the site's shape emerges from the content, not the other way around. Tech stack decisions are deferred until just before they're needed.

Target: Launch before June 2026 election. Election day is **June 2026**.

---

## Phase 1: Research — Voter Guide Landscape

**Goal**: Understand what makes an excellent voter guide. Build a reference library of exemplars.

| Step | Description |
|------|-------------|
| 1.1 | Use `swain-search` to trove the best nonpartisan voter guides: League of Women Voters (Vote411), Ballotpedia, local newspaper guides, and any South Portland/Maine-specific guides from prior cycles |
| 1.2 | Analyze each exemplar: what data do they present? how is it structured? what's missing? what makes them useful or confusing? |
| 1.3 | Extract a canonical data model from the analysis — what entities, attributes, and relationships does a voter guide need? |
| 1.4 | Write `docs/architecture/data-model.md` capturing the emergent data model as aggregates and entities in the Election Data and Voter Guide Content bounded contexts |
| 1.5 | Write `docs/ubiquitous-language/election-data.md` and `docs/ubiquitous-language/voter-guide-content.md` defining terms discovered during research |
| **Check** | Trove of 5–10 reviewed voter guides; data model doc written; ubiquitous language terms defined |

---

## Phase 2: Data Sources & Compilation

**Goal**: Identify every source of truth for the June 2026 South Portland election and compile raw data.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 2.1 | Find the June 2026 election on Maine Secretary of State website — certified candidate list, ballot question text, polling locations, precinct maps | — |
| 2.2 | Find South Portland city clerk page for local election info (local races not on SoS site, local ballot questions) | — |
| 2.3 | For each data source: capture URL, update frequency, format (PDF/HTML/API), and any access notes | 2.1, 2.2 |
| 2.4 | Determine whether candidate filings are final or subject to change (primary certification timeline, withdrawal deadlines) | 2.1 |
| 2.5 | Polling locations: cross-reference City Clerk + SoS to get all South Portland precincts and their assigned polling places | 2.1, 2.2 |
| 2.6 | Identify gaps: what data isn't available from official sources and must be collected manually (candidate stances, endorsements, etc.) | 2.3 |
| **Check** | Source inventory complete; gaps identified; raw data from SoS and city clerk compiled |

---

## Phase 3: Research — Candidates & Issues

**Goal**: Deep research on every candidate and ballot question using `rk` and `swain-search`.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 3.1 | For each race: use `swain-search` to trove candidate information — campaign websites, social media, news coverage, debate footage | 2.6 |
| 3.2 | For each candidate: ingest all sources via `rk add` into `~/projects/boswell` with tagging per candidate and issue area | 3.1 |
| 3.3 | Process media via `media-summary` skill: YouTube debates, candidate interviews, campaign ads, podcasts | 3.2 |
| 3.4 | For each ballot question: find the full text, fiscal impact statement, legislative history (if legislative referendum), news analysis, editorial positions | 2.6 |
| 3.5 | Ingest ballot question sources via `rk add`, process media | 3.4 |
| 3.6 | Import relevant troves from upstream projects: school-board-review (candidate overlap?), school-budget-FY27 (budget referendum context), sopo-alpr-awareness (if ALPR on ballot) | — |
| 3.7 | Run `rk investigate` threads per race and per ballot question | 3.3, 3.5, 3.6 |
| 3.8 | Generate `rk` syntheses per candidate (positions by issue area) and per ballot question (pro/con arguments, fiscal impact, endorsing orgs) | 3.7 |
| **Check** | `rk search "candidate X position on housing"` returns synthesized sources; each candidate has sources ingested; each ballot question has full text + analysis sources |

---

## Phase 4: Content Authoring

**Goal**: Nonpartisan editorial content from research syntheses.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 4.1 | For each race: write a `RaceSummary` — which office, candidates, key issues voters should consider, where to learn more. Content emerges from Phase 3 syntheses | 3.8 |
| 4.2 | For each candidate: write profile — background (from official sources), stated positions per issue area (with inline source citations to `rk`), campaign contact/links | 3.8 |
| 4.3 | For each ballot question: write `QuestionAnalysis` — what it proposes in plain language, what a yes/no vote means, fiscal impact, who supports/opposes (attributed), endorsements | 3.8 |
| 4.4 | Write voter resources: registration check, polling place lookup (by precinct), ID requirements, absentee/mail-in voting, key dates | 2.5 |
| 4.5 | Content review: every claim cites a source, no editorializing, balanced coverage across all candidates in a race | 4.1–4.4 |
| 4.6 | Apply content guidelines: 8th-grade reading level, AP style, neutral language audit | 4.5 |
| **Check** | All content authored from primary sources; each fact attributable to a specific source in `rk`; content guidelines pass |

---

## Phase 5: Site Emergence

**Goal**: Let the site's shape emerge from the content. Make tech stack decisions, build the site.

Now we know the data model, the content types, the page types needed, and the user journeys. We can choose the SSG and templates with confidence.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 5.1 | Map content types to page types based on actual authored content (from Phase 4). What pages do we need? What templates? What navigation? | 4.5 |
| 5.2 | Write `docs/user-experience/journeys.md` based on real content structure | 5.1 |
| 5.3 | **Now** choose SSG: evaluate Eleventy vs Astro vs other against actual content requirements. Write ADR | 5.1 |
| 5.4 | Design system from content: typography (system font stack), high-contrast color palette, spacing. Write `docs/user-experience/design-system.md` | 5.1 |
| 5.5 | Scaffold project with SSG, configure `npm run dev/build/preview` | 5.3 |
| 5.6 | Build templates: base layout, race page, candidate profile, ballot question analysis, home page, voter resources, compare modes | 5.4, 5.5 |
| 5.7 | Build comparison views: side-by-side candidate positions per issue, pro/con tables for ballot questions | 5.6 |
| 5.8 | Add structured data (JSON-LD `Election` schema.org type) | 5.6 |
| 5.9 | Mobile-first responsive layout: test 320px, 375px, 768px, 1024px | 5.6 |
| 5.10 | Set up CI/CD (GitHub Actions or Forgejo Actions) — build on PR, deploy main to static host | 5.5 |
| 5.11 | Install quality tooling: `git-secrets`, `npm run lint`, `npm run test:links` | 5.5 |
| 5.12 | Write spoke docs: `docs/tech-stack/frontend.md`, `docs/tech-stack/content.md`, `docs/tech-stack/infrastructure.md` | 5.3 |
| **Check** | `npm run build` produces deployable site; all content renders correctly; passes mobile viewport checks |

---

## Phase 6: Accessibility

**Goal**: WCAG 2.1 AA compliance.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 6.1 | Automated audit: axe-core or WAVE on all page templates | 5.6 |
| 6.2 | Manual audit: keyboard-only navigation; screen reader (VoiceOver/NVDA) | 5.6 |
| 6.3 | Fix issues: color contrast, focus indicators, heading hierarchy, alt text, ARIA labels | 6.1, 6.2 |
| 6.4 | Test zoom 200%, reduced motion preferences | 6.3 |
| 6.5 | Write `docs/user-experience/accessibility.md` with checklist and audit results | 6.1–6.4 |
| **Check** | No critical/serious violations; full keyboard nav works; screen reader navigates all content |

---

## Phase 7: QA & Launch

**Goal**: Verify correctness, publish.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 7.1 | Link checker: all internal and external links resolve | 5.6 |
| 7.2 | Content accuracy audit: spot-check every claim against source material in `rk` | 4.5 |
| 7.3 | Performance budget: LCP < 2s, TBT < 200ms, CLS < 0.1 on mobile | 6.3 |
| 7.4 | Build automated tests: data validity, template rendering, link integrity | — |
| 7.5 | Preview deploy to static host; smoke test | 7.4 |
| 7.6 | Configure custom domain + DNS | — |
| 7.7 | Enable privacy-respecting analytics (Plausible or Fathom) | — |
| 7.8 | Deploy to production | 7.5, 7.6 |
| 7.9 | Share with community: South Portland Facebook groups, Nextdoor, local news, city clerk, neighborhood listservs | 7.8 |
| **Check** | `npm test` passes; site live at production URL; analytics verified |

---

## Phase 8: Monitor & Archive

**Goal**: Monitor during election lead-up, archive post-election.

| Step | Description | Dependencies |
|------|-------------|--------------|
| 8.1 | Monitor uptime, traffic, and user feedback during election week | 7.8 |
| 8.2 | Process content updates if last-minute changes occur (candidate withdrawals, new filings) | — |
| 8.3 | Post-election: archive site, write retrospective in `docs/plans/retrospective.md` | — |
| **Check** | Uptime OK during election week; retrospective written |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Candidate data changes (withdrawals, additions) | Medium | High | Design data model to accommodate updates; content freeze date with update buffer |
| Ballot question text not finalized until late | Medium | High | Phase 2 identifies certification timeline; analysis waits for certified language |
| Research scope exceeds available time | Medium | Medium | Prioritize competitive races; use `rk` synthesis to scale analysis |
| Hosting outage during election week | Low | Critical | Static site on CDN; second provider fallback |
| Last-minute candidate materials | Medium | Medium | Disclaimers with "as of [date]" timestamp on all pages |
| Accessibility issues found late | Low | High | Phase 6 starts early enough for remediation buffer |

---

## Spoke Documents to Create

| File | Phase |
|------|-------|
| `docs/architecture/data-model.md` | 1 |
| `docs/ubiquitous-language/election-data.md` | 1 |
| `docs/ubiquitous-language/voter-guide-content.md` | 1 |
| `docs/user-experience/journeys.md` | 5 |
| `docs/user-experience/design-system.md` | 5 |
| `docs/tech-stack/frontend.md` | 5 |
| `docs/tech-stack/content.md` | 5 |
| `docs/tech-stack/infrastructure.md` | 5 |
| `docs/user-experience/accessibility.md` | 6 |
| `docs/architecture/context-map.md` | 5 (when architecture solidifies) |
| `docs/architecture/c4.md` | 5 (when architecture solidifies) |

---

## Quality Gates

Every phase gate must pass before starting the next phase. Gates are defined in each phase's **Check** line.
