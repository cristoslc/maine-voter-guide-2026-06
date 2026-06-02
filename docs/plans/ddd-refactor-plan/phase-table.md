# Phase Table

Every phase transforms `_data/` files from current structure to new structure.

## Overview

| Phase | Name | Input Files | Output / Rewritten Files | New Files Created |
|-------|------|-------------|--------------------------|-------------------|
| 1 | Foundation | `races.js`, `jurisdictions.js`, `election-2026-06.yml` | `jurisdictions.js` (rewrite) | `geography.js`, `offices.js`, `parties.js`, `issues.js`, `pollingLocations.js`, `precincts.js`, `election.js` |
| 2 | Race normalization | `races.js` (current) | `races.js` (rewrite) | — |
| 3 | Candidate registry | `election-2026-06.yml` (candidate data), `races.js` (candidate names) | — | `candidates.js` |
| 4 | Sources registry | `races.js`, `ballotQuestions.js` (inline sourceUrl/sourceLabel) | `races.js` (position sourceIds), `ballotQuestions.js` (sourceIds) | `sources.js` |
| 5 | Scaffolding | All hub files, spoke dirs | Hub files (rewrite), spoke files (create missing) | 6 new spoke files |
| 6 | Polish + testing | Built site | — | — |

## Migration Dependency Graph

```
Phase 1 (foundation)
  ↓
Phase 2 (race normalization) ──depends on── Phase 1 offices/parties/issues/geography/jurisdictions
  ↓
Phase 3 (candidate registry) ──depends on── Phase 2 race slugs + candidate names
  ↓
Phase 4 (sources registry) ──depends on── Phase 2 race slugs + position data
  ↓
Phase 5 (scaffolding) ──depends on── Phase 1-4 (documents the result)
  ↓
Phase 6 (polish + testing)
```

## Commit Strategy

Each phase is one commit. Example:

```
commit 1: "Phase 1: foundation registries + jurisdiction hierarchy + election"
commit 2: "Phase 2: normalize races, deduplicate statewide, inheritance"
commit 3: "Phase 3: candidate registry from YAML"
commit 4: "Phase 4: sources registry, inline sourceIds"
commit 5: "Phase 5: scaffolding docs in sync with new model"
commit 6: "Phase 6: polish, tests, cleanup"
```

Rollback any phase with `git checkout HEAD~1 -- _data/`