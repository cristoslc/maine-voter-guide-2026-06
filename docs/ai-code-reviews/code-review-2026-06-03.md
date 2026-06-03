# Code Review: PR #1 ddd-refactor -> main

| Field | Value |
|---|---|
| Refs | PR #1 `ddd-refactor` -> `main` |
| Platform | GitHub |
| Diff method | `git-ref-diff` |
| Dispatch | specialist |
| Date | 2026-06-03 |

## Models

| Role | Model |
|---|---|
| Orchestrator (report author) | `deepseek-v4-flash:cloud` |
| security subagent | `deepseek-v4-flash:cloud` |
| style subagent | `deepseek-v4-flash:cloud` |
| logic subagent | `deepseek-v4-flash:cloud` |
| docs subagent | `deepseek-v4-flash:cloud` |
| memory subagent | `deepseek-v4-flash:cloud` |
| synthesis subagent | `deepseek-v4-flash:cloud` |

## Recommendation: **BLOCKED**

One critical finding blocks this merge. The diff has significant structural improvements (party data model rename, source centralization, test infrastructure) but a copy-paste bug introduces incorrect source attribution, and there are multiple high-severity null dereference risks, fragile prefix matching, style regressions, and undocumented complex logic. All findings must be resolved before merge.

### Summary

- **1 critical** — Copy-paste error in `_data/races.js`: `hd-122-democratic` sourcesMain includes HD-120 candidate sources
- **9 high** — Null dereferences in templates (2x), fragile `startsWith` matching in `resolveCandidate`, `.editorconfig` violates own rule, new files missing POSIX newlines, inline CSS, undocumented complex functions (3x)
- **12 medium** — Filter semantics ambiguity, dual source-rendering paths, cross-party fallback gap, null fields in data, inconsistent indentation/IDs, undocumented magic values, test isolation gap, missing schema docs
- **9 low** — Data error masking, duplicate labels, silent tag pass-through, timezone issue, duplicate filter registration, trailing-newline in plans, undocumented patterns

### Per-Agent Findings

---

#### Security — **PASSED** (0 findings)

No security issues. The codebase is a static site with no runtime user input, authentication, databases, or API endpoints. All data from controlled project files. Pre-commit hook properly quotes URL variables. Security posture is appropriate for a non-interactive, read-only static site.

---

#### Style — **WARNING** (10 findings)

| Severity | Finding |
|---|---|
| **HIGH** | `.editorconfig` itself missing trailing newline — file fails its own `insert_final_newline = true` rule |
| **HIGH** | Multiple new files missing POSIX trailing newlines: `_data/election.js`, `test/data-integrity.test.js`, `test/eleventy-filters.test.js`, `AGENTS.md`, `UBIQUITOUS-LANGUAGE.md`, `docs/plans/pr-1-review-fixes.md` |
| **HIGH** | Inline CSS in `_layouts/race.njk` — `style="margin:0"` on `<h3>` elements (lines 197, 224) contradicts CSS-first mobile-first approach |
| **MEDIUM** | Filter tests re-implement logic instead of importing actual registered filters from `.eleventy.js` |
| **MEDIUM** | Unnecessary null fields in candidate data (`"occupation": null`, `"ballotpediaUrl": null`) add noise |
| **MEDIUM** | Inconsistent indentation in Nunjucks template conditionals in `_layouts/race.njk` |
| **MEDIUM** | Inconsistent source ID naming convention in `_data/races.js` — mixed descriptive and generic patterns |
| **LOW** | Date parsing with `new Date("2026-06-09")` may have timezone issues |
| **LOW** | Duplicated `officeSlugFromTitle` filter registration in `.eleventy.js` (lines 92 and 158) |
| **LOW** | Plans file `docs/plans/pr-1-review-fixes.md` missing trailing newline |

---

#### Logic — **FAILED** (10 findings)

| Severity | Finding |
|---|---|
| **CRITICAL** | **Copy-paste error: `hd-122-democratic` sourcesMain includes HD-120 candidate sources** — Matthew Beck's race lists `source-068-campaign-website` (Jason Shedlock's HD-120 campaign site) and `source-069-wmtw` (article about Deqa Dhalac in HD-120). Copied verbatim from `hd-120-democratic` without updating. Fix: remove these two sources, keep only `source-070-campaign-website` and `source-073-maine-afl-cio-early-endorsements`. |
| **HIGH** | Null dereference in `_layouts/race.njk:208` — `posSource.url` accessed without null guard in cross-party-preview source resolution |
| **HIGH** | Null dereference in `_layouts/race.njk:141` — same pattern in main candidate block |
| **HIGH** | `resolveCandidate` uses `startsWith` prefix matching (`.eleventy.js:149`) — fragile, matches `'Ann'` to `'Anne Carney'`, `'John'` to `'Johnny'` |
| **MEDIUM** | `find` filter changed semantics — `(item.slug || item.id) === key` makes slug/id ambiguous; `'ABC'` could match by slug or id |
| **MEDIUM** | Dual source-rendering paths in `race.njk` create logic gap — if both `raceSources` and `race.sourcesMain` fail, deeper sources go unrendered |
| **MEDIUM** | Cross-party fallback references legacy `parties[0]` structure — after `parties→party` rename, `crossPartyPreview` may never match |
| **LOW** | `getEffectiveJurisdictionIds` treats missing jurisdiction same as null input — masks data errors |
| **LOW** | Duplicate `'Maine Public'` labels for different source entries (source-015, source-022, source-027) |
| **LOW** | `partyTag` filter silently passes null tag through — shows raw `'d'`/`'r'` instead of erroring |

---

#### Docs — **WARNING** (13 findings)

| Severity | Finding |
|---|---|
| **HIGH** | `resolveOfficeRaw` has 5 undocumented fallback strategies (aliases → exact id → slugified id → slugified title → id with 'district' removed) |
| **HIGH** | `collectSources` has no documentation for its complex 4-path traversal (`.eleventy.js:168-202`) |
| **HIGH** | `resolveIssue` filter slugify-match order undocumented — slugified id takes priority over label match with no warning about collisions |
| **MEDIUM** | `resolveOfficeRaw` regex magic value `/\bdistrict\b-?/` undocumented (`.eleventy.js:108`) |
| **MEDIUM** | `resolveCandidate` name prefix matching is undocumented (`.eleventy.js:149`) |
| **MEDIUM** | `getEffectiveJurisdictionIds` no documentation for jurisdiction inheritance, geoRef, or parent chain (`.eleventy.js:22-34`) |
| **MEDIUM** | `findCrossPartyRace` assumption documented in filter but template still uses old `parties[0]` structure |
| **MEDIUM** | No module-level documentation for any `_data/*.js` registry file (offices, geography, parties, issues, etc.) |
| **MEDIUM** | Test files reimplement filter logic inline without explanation of intentional isolation |
| **LOW** | `resolveOffice` merge rules (base spread, extension override, districtNote append) undocumented |
| **LOW** | Pre-commit timeout magic values (`CURL_TIMEOUT=8`, `PLAYWRIGHT_TIMEOUT_MS=15000`) undocumented |
| **LOW** | Party colors in `_data/parties.js` have no source attribution |
| **LOW** | `slugify` function (`.eleventy.js:36-41`) handles null/undefined but has no JSDoc |

---

#### Memory — **PASSED** (1 finding)

| Severity | Finding |
|---|---|
| **LOW** | `collectSources` filter allocates per-race during build (~40 invocations, ~1KB each). Acceptable for build-time. No retained references, no leaks, no unclosed resources. |

## Finding Counts

| Agent | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Security | 0 | 0 | 0 | 0 | 0 |
| Style | 0 | 3 | 4 | 3 | 10 |
| Logic | 1 | 3 | 3 | 3 | 10 |
| Docs | 0 | 3 | 6 | 4 | 13 |
| Memory | 0 | 0 | 0 | 1 | 1 |
| **Merged (synthesis)** | **1** | **9** | **12** | **9** | **31** |

---

*Report generated by `deepseek-v4-flash:cloud` (orchestrator) with findings from 5 specialist subagents.*