# Project Documentation

Hub-and-spoke documentation for the Maine Voter Guide — South Portland, June 2026.

## Structure

Each upper-case file in the project root is a **hub** — a concise overview that points into a `docs/` subdirectory (the **spoke**) for detail.

| Hub | Spoke | Purpose |
|-----|-------|---------|
| [ARCHITECTURE.md](../ARCHITECTURE.md) | `docs/architecture/` | C4 models, context map, data model |
| [UBIQUITOUS-LANGUAGE.md](../UBIQUITOUS-LANGUAGE.md) | `docs/ubiquitous-language/` | Domain vocabulary per context |
| [TECH-STACK.md](../TECH-STACK.md) | `docs/tech-stack/` | Language, framework, infrastructure |
| [DEVELOPER-WORKFLOWS.md](../DEVELOPER-WORKFLOWS.md) | `docs/developer-workflows/` | Build, test, deploy flows |
| [USER-EXPERIENCE.md](../USER-EXPERIENCE.md) | `docs/user-experience/` | UX principles, journeys, a11y |

Additional directories:

- `docs/adr/` — Architecture decision records (no hub file)
- `docs/plans/` — Project planning documents

## How to navigate

1. Start with [PURPOSE.md](../PURPOSE.md) for project intent
2. Read the relevant hub file for a topic overview
3. Drill into the spoke directory for detail