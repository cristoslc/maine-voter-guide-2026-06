# Architecture

This project follows a hub-and-spoke documentation model. This hub provides an overview; detailed documents live in `docs/architecture/`.

## Bounded Contexts

1. **Research** — Ingestion and synthesis of candidate websites, debate performances, ads, public speeches, and other source material. Aggregates: `Source`, `Investigation`, `Synthesis`. Tooling: `research-keeper` (`rk`) for library management, `media-summary` for transcript extraction. Upstream projects provide existing evidence pools.

2. **Election Data** — Candidates, ballot questions, polling locations, election dates. Aggregates: `Election`, `Race`, `BallotQuestion`. Source: Maine Secretary of State and South Portland city clerk.

3. **Voter Guide Content** — Editorial content explaining ballot questions, candidate positions, and voter resources. Aggregates: `VoterGuide`, `RaceSummary`, `QuestionAnalysis`.

4. **Presentation** — Static site rendering, templates, stylesheets, and accessibility compliance. Aggregates: `Site`, `Page`.

## Context Map

```
Upstream Projects                Research ──────► Election Data ──► Voter Guide Content ──► Presentation
(school-board-review,              │                 (upstream)          (core)               (downstream)
 school-budget-FY27,                │
 sopo-alpr-awareness)               │
                                    │
                              research-keeper (rk)
                              media-summary skill
```

- Upstream civic projects (`south-portland-school-board-review`, `south-portland-school-budget-FY27`, `sopo-alpr-awareness`) provide existing research and evidence pools via shared `rk` library.
- Research ingest candidate web sites, debate footage, ads, speeches, and public records via `rk` and `media-summary`.
- Election Data publishes raw structured data (JSON/YAML), enriched by research findings.
- Voter Guide Content consumes election data and research syntheses to produce editorial content.
- Presentation consumes guide content and renders the static site.

## Upstream Projects

| Project | Path | Relevance |
|---------|------|-----------|
| `south-portland-school-board-review` | `~/projects/south-portland-school-board-review` | School board meeting transcripts, votes, analysis |
| `south-portland-school-budget-FY27` | `~/projects/south-portland-school-budget-FY27` | FY27 budget analysis ($8.4M gap, 78 positions cut) |
| `south-portland-school-budget-FY27-reference` | `~/projects/south-portland-school-budget-FY27-reference` | Reference data for FY27 budget analysis |
| `sopo-alpr-awareness` | `~/projects/sopo-alpr-awareness` | ALPR surveillance research (Flock Safety) |
| `boswell` | `~/projects/boswell` | Shared research library (`rk` instance) backing all civic projects |
| `common-bell-research` | `~/projects/common-bell-research` | Common Bell NE civic research infrastructure |

## Research Tooling

| Tool | Path | Role |
|------|------|------|
| `research-keeper` (`rk`) | `~/code/research-keeper` | Agent-native research library: add sources, auto-tag, synthesize by theme, rolling understanding |
| `media-summary` skill | `~/Documents/code/media-summary` | Download and summarize media (video, audio, X threads, web articles) into structured markdown |

## Key Decisions

See `docs/adr/` for architecture decision records.

## Spokes

- `docs/architecture/context-map.md` — detailed context map with relationships
- `docs/architecture/c4.md` — C4 model diagrams
- `docs/architecture/data-model.md` — aggregates, entities, value objects