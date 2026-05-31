# Agents

Project-specific guidance for AI agents working in this repository.

## Purpose

See [PURPOSE.md](../PURPOSE.md) — this project is a nonpartisan voter's guide for South Portland, Maine's June 2026 election.

## Project Navigation

See [`.agents/agents-md-detail/project-navigation.md`](agents-md-detail/project-navigation.md) for how to orient yourself in this codebase.

## Key Conventions

- All content must be **nonpartisan** and **factual**. Attribute opinions to named sources.
- Use terms from [UBIQUITOUS-LANGUAGE.md](../UBIQUITOUS-LANGUAGE.md). Avoid deprecated synonyms.
- Dates and candidate data must cite the Maine Secretary of State or South Portland city clerk as source.
- Mobile-first design. Test renders on 320px viewport before merging.
- Static site, no client-side JavaScript required for core content.

## Research Tooling

- **research-keeper** (`rk`) at `~/code/research-keeper/` — CLI for adding, tagging, and synthesizing sources. Project library: `~/projects/boswell/`.
- **media-summary** skill at `~/Documents/code/media-summary/` — Media download and summarization (YouTube, podcasts, X threads, web articles).
- **Upstream projects** — School board review (`~/projects/south-portland-school-board-review`), FY27 budget analysis (`~/projects/south-portland-school-budget-FY27`), ALPR awareness (`~/projects/sopo-alpr-awareness`) provide existing evidence pools.

Use `rk add <url>` to ingest candidate websites, debates, ads, and speeches. Use `rk search` / `rk investigate` to query research before writing content.

## Spokes

Agent-specific detail lives in `.agents/agents-md-detail/`:

- `project-navigation.md` — How to orient in this repo
- `content-guidelines.md` — Nonpartisan writing standards, sourcing rules