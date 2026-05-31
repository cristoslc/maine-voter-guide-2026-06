# Project Navigation

## Starting points

- `PURPOSE.md` — one-paragraph outcome
- `README.md` — user-facing landing page
- `AGENTS.md` — this file, plus `.agents/agents-md-detail/` for agent-specific guidance

## Hubs and spokes

Each upper-case hub indexes detail in a `docs/` subdirectory:

- `ARCHITECTURE.md` → `docs/architecture/`
- `UBIQUITOUS-LANGUAGE.md` → `docs/ubiquitous-language/`
- `TECH-STACK.md` → `docs/tech-stack/`
- `DEVELOPER-WORKFLOWS.md` → `docs/developer-workflows/`
- `USER-EXPERIENCE.md` → `docs/user-experience/`
- `docs/adr/` — numbered decision records (no hub file for these)

Read the hub first, then drill into spokes when you need detail.

All `docs/` directories have a `README.md` explaining that directory's contents and purpose — start there when entering a new directory.

## Research tooling

- `~/code/research-keeper/` — `rk` CLI source code
- `~/projects/boswell/` — Shared research library instance (`rk`) backing this and all civic projects
- `~/Documents/code/media-summary/` — Media summarization skill

## Upstream civic projects

- `~/projects/south-portland-school-board-review/` — School board meeting transcripts and analysis
- `~/projects/south-portland-school-budget-FY27/` — FY27 budget analysis
- `~/projects/south-portland-school-budget-FY27-reference/` — Reference data for FY27 budget
- `~/projects/sopo-alpr-awareness/` — ALPR surveillance research
- `~/projects/common-bell-research/` — Civic research infrastructure (Common Bell NE)

## Key files

- `src/` — site source code (templates, pages, data)
- `_data/` — structured election data (YAML/JSON)
- `content/` — editorial content (Markdown)
- `public/` — static assets (images, fonts, icons)