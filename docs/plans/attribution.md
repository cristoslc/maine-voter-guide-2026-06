# Plan: ATTRIBUTION.md

## What This Document Is
A comprehensive attribution and licensing statement for all content, data, code, and third-party assets used in the voter guide. It serves three purposes:
1. **Legal compliance**: Properly licenses our own work and respects others'
2. **Credibility**: Shows readers exactly where information comes from
3. **Reusability**: Enables other civic tech projects to fork, adapt, or learn from our approach

## Proposed Structure

### 1. Content License
- **Text content** (candidate bios, position summaries, context): CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike)
- **Data** (`_data/races.js`, structured candidate information): CC0 (public domain dedication)
- **Rationale**: Text has editorial voice worth attribution; raw data should be maximally reusable

### 2. Code License
- **Templates, CSS, build scripts**: MIT License
- **Research tools** (`rk`, custom crawlers): MIT or GPL (match upstream)
- **Eleventy configuration**: MIT (matches Eleventy's own license)

### 3. Third-Party Content Attribution
Categorical list of all external content used:

#### News Media (text excerpts and facts)
- [The Maine Monitor](https://themainemonitor.org) — nonprofit local news; articles cited inline with URLs
- [Portland Press Herald](https://www.pressherald.com) — daily newspaper; subscriber-restricted articles linked where possible
- [Bangor Daily News](https://bangordailynews.com) — statewide coverage
- [Maine Public](https://www.mainepublic.org) — NPR affiliate; candidate profiles
- [WMTW](https://www.wmtw.com) — TV news; debate coverage
- [Maine Morning Star](https://mainemorningstar.com) — independent news; debate takeaways
- [PBS](https://www.pbs.org) — debate transcripts
- [CNN](https://www.cnn.com), [NYT](https://www.nytimes.com), [AP](https://apnews.com) — national breaking news on statewide races
- [The Hill](https://thehill.com) — federal politics coverage

Use policy: 
- Short excerpts used under fair use for nonpartisan voter education
- All sources linked inline and listed at page bottom
- No paywalled content reproduced in full

#### Government Sources (public domain)
- [Maine Secretary of State](https://www.maine.gov/sos/elections-voting) — ballot information, candidate lists, election dates
- [South Portland City Clerk](https://www.southportland.org/195/Elections-Voter-Registration) — local polling info, municipal ballot questions
- [Maine Legislature](https://legislature.maine.gov) — bill text, voting records, committee assignments
- [UNH Survey Center](https://scholars.unh.edu/survey_center_polls/) — polling data (cited with DOI/permanent URL)
- [Federal Election Commission](https://www.fec.gov) — campaign finance (via OpenSecrets where aggregated)

#### Data Sources
- [Ballotpedia](https://ballotpedia.org) — candidate biographical data used as initial source, verified independently
- [OpenSecrets](https://www.opensecrets.org) — campaign finance aggregation
- [VOTE411](https://www.vote411.org) — candidate questionnaire responses used as primary source
- Wikipedia — used only for uncontested factual background (e.g., "Susan Collins was first elected in 1996"), never for controversies or editorial claims

### 4. Image and Asset Attribution
- **Favicon**: Custom-generated; no external attribution needed
- **Hero/banner images**: None currently; if added, require CC0 or CC BY source with attribution
- **Icons**: No icon font in use; if added, use [Heroicons](https://heroicons.com) (MIT) or [Phosphor](https://phosphoricons.com) (MIT)

### 5. Tool Attribution
Software/tools used in production:
- [Eleventy](https://www.11ty.dev) (MIT) — static site generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) (BSD-2) — templating engine
- [Node.js](https://nodejs.org) (MIT) — runtime
- [Brave Search API](https://api.search.brave.com) — research queries
- [research-keeper](https://github.com/cristoslc/research-keeper) — source management (MIT)
- [media-summary](https://github.com/cristoslc/media-summary) — media ingestion/summarization (MIT)
- GitHub Pages — hosting (GitHub ToS)

### 6. Prior Art and Inspirations
Projects that influenced methodology, design, or scope:

- **South Portland School Budget FY27 Analysis** (`~/projects/south-portland-school-budget-FY27/`)
  - Contributed: PDF extraction pipeline for municipal documents
  - Reused: Budget-line normalization approach
  
- **South Portland School Board Review** (`~/projects/south-portland-school-board-review/`)
  - Contributed: Candidate background research framework
  - Reused: Structured comparison table pattern

- **SoPo ALPR Awareness** (`~/projects/sopo-alpr-awareness/`)
  - Contributed: Public records request templates and tracking
  - Reused: Evidence-pool accumulation methodology

- **Ballotpedia** — structural inspiration for candidate comparison tables; we differ by being local-depth rather than national-breadth

- **Project Vote Smart** — citation density standard and fact-checking methodology

- **League of Women Voters VOTE411** — nonpartisanship model and candidate questionnaire approach

## Affected Files (When Implemented)
- **New**: `ATTRIBUTION.md` at project root
- **New**: `LICENSE` file (MIT for code, CC BY-SA 4.0 note for text, CC0 note for data)
- **Modified**: `README.md` — add license badges and attribution section
- **Modified**: Site footer — add "Content licensed under CC BY-SA 4.0" link

## Acceptance Criteria
- [ ] Every external source category is covered (news, gov, data, tools, prior art)
- [ ] Licensing is explicit for content, data, and code (three separate statements)
- [ ] Fair use rationale is stated for news excerpts
- [ ] Prior art is credited with specific project paths and contributions
- [ ] Document includes version/date and "last reviewed" field
