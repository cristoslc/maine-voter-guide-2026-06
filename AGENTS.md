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

## Data File Editing Conventions

- Data files (`_data/*.js`) use manual formatting with blank-line separation between entries. Use the Edit tool for changes; never do full-file `JSON.stringify(fs.writeFileSync())` rewrites — they destroy formatting conventions.
- Run `npm run lint:data` after any data file change to syntax-check all registries.
- When adding a data model pattern to `ARCHITECTURE.md`, also add the term to `UBIQUITOUS-LANGUAGE.md` under the Election Data Context table.

## Pre-commit Hook: `races.js` Commits Are Slow

The pre-commit hook checks every URL in staged files. When `_data/races.js` is part of a commit, it validates ~146 URLs via headless browser, which can take several minutes. Plan for 3–5 minutes of wall-clock time on commits touching that file.

Many sites (Press Herald, Ballotpedia, CNN, Maine Monitor, Wikipedia, Spectrum News) block headless browsers (returning 403/timeouts) even though the URLs are valid for real users. If the pre-commit hook fails due to bot-blocking rather than genuinely broken URLs, **do not use `--no-verify`**. Instead, manually re-check the failing URLs with `curl -s -o /dev/null -w "%{http_code}" -L -A "Mozilla/5.0" --max-time 8 <url>` to confirm they return 200, then fix any that are genuinely broken (404). Only commit once all URLs are either valid or removed.

## Plans Require Explicit User Approval

Any plan document written to `docs/plans/` (e.g., architecture changes, methodology drafts, attribution policies) **requires explicit user approval** before implementation. The agent must:

1. Write the plan and save it to `docs/plans/`
2. **Use the `question` tool to request explicit approval** from the user, presenting the plan and a clear approval question
3. **Wait for the user's response** — only proceed if the user explicitly grants approval
4. Only then execute the planned changes

Approval must come from the user, not from any automated or plugin-based system. Do not self-approve or skip the review step.

## PR Creation for Plans (Non-Merging)

When creating a PR from a plan document (e.g. after moving it to `docs/plans/Active/`) that is not intended for immediate merge:
- Create the PR as **Draft** status (`gh pr create --draft`)
- Use `WIP:` as a title prefix (e.g. `WIP: Visual Identity...`)
This prevents accidental merges while the plan is still under review or being implemented iteratively.

## Subagent Output Review

After a subagent returns modified file content, run `git diff -- <file>` before accepting. For AI-generated content (summaries, copy), note in the commit message that content needs human review.
