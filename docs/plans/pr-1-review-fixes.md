# PR #1 Review: Fix Plan

## Items

### 1. Susan Collins `incumbent: false` → `true`
**File:** `_data/candidates.js:240`
**Fix:** Change `incumbent: false` to `incumbent: true` for Susan Collins.

### 2. Link campaign websites to candidates
**Problem:** 28/34 candidates missing `campaignWebsite`. Source URLs exist in `sources.js` but aren't linked to candidate records.
**Approach:** For each candidate with a known campaign URL in `sources.js`, add a `campaignWebsite` field pointing to the source ID (e.g., `source-030`). Requires mapping source URLs to candidates.
**Deferred items:** Some candidates may not have campaign websites discoverable yet — those can remain empty.

### 3. `findCrossPartyRace` assumes `parties[0]`
**Files:** `.eleventy.js:200-202`, `_layouts/race.njk:111`
**Fix:** Add a comment noting the assumption. The pattern works for current data (races have exactly one party block with one party). If a race ever has multiple party blocks, `findCrossPartyRace` would need to iterate. For now, the existing code is correct — document the assumption rather than over-engineer.

### 4. Stale `state-rep-democratic`/`state-rep-republican` slugs
**File:** `_data/races.js`
**Context:** These catch-all slugs still carry candidate content for HD-120 (Jason Shedlock, Michael Dougherty) and HD-122 (Matthew Beck) — districts that don't yet have dedicated race pages. HD-121 has dedicated slugs under `cape-elizabeth`.
**Fix:** Keep the entries for now (they still serve a purpose). Add a `todo: remove when HD-120/HD-122 district races are created` comment. Update the stale slug test to accept them as known exceptions rather than flagging as errors.

### 5. Add trailing newlines to 11 files
**Files:** `_data/sources.js`, `_data/offices.js`, `_data/parties.js`, `_data/issues.js`, `_data/candidates.js`, `_data/geography.js`, `_data/jurisdictions.js`, `_data/ballotQuestions.js`, `_layouts/race.njk`, `_layouts/ballot-question.njk`, `content/pages/jurisdiction-home.md`
**Fix:** Append `\n` to end of each file.

### 6. Fill source summaries
**File:** `_data/sources.js`
**Fix:** Write hand-written 1-2 sentence summaries for all 106 sources describing what the source provides (e.g., candidate statements, official results, news coverage).

### 7. Deduplicate source entries (`source-003`/`source-004`)
**File:** `_data/sources.js`
**Fix:** Remove `source-003` and `source-004` (duplicates of `source-001`/`source-002`). Update any references in `races.js` positions to use `source-001`/`source-002` instead.

### 8. Document `extends` inheritance pattern in UBIQUITOUS-LANGUAGE.md
**File:** `UBIQUITOUS-LANGUAGE.md`
**Fix:** Add an `extends` term explaining the inheritance pattern used by the Office registry.

## Phase 0: Test Infrastructure & Guardrails

Before fixing bugs, add tests that would catch these classes of failure in the future.

### Framework setup
- Add `vitest` as devDependency
- Create `vitest.config.js` (pointing to test root)
- Add `npm run test` (`vitest run`) and `npm run test:watch` (`vitest`) scripts

### Unit tests for Eleventy filters (`.eleventy.js`)
- **`findCrossPartyRace`** — Test that it finds the opposing party race correctly; document `parties[0]` assumption in test
- **`resolveOffice`** — Test extends inheritance resolution (base office → district override)
- **`resolveCandidate`** — Test by-slug lookup
- **`effectiveJurisdictionIds`** — Test jurisdiction inheritance chain

### Data integrity tests (`_data/*.test.js`)
Tests that guard against the exact bugs from the PR review:
- **Candidates**: every candidate with `knownIncumbent: true` in a lookup table has `incumbent: true`; every candidate with a known campaign URL in `sources.js` has `campaignWebsite` set
- **Sources**: every source has a non-empty `summary`; no duplicate URLs across source entries
- **Races**: no stale/legacy slugs exist (whitelist of expected slugs); every race's `position` source references resolve to existing source IDs
- **Parties**: every party referenced by a race exists in the parties registry
- **Offices**: every office referenced by a race exists; `extends` chains terminate at a base office

### Lint checks
- All `.js` data files end with trailing newline (can be a vitest test scanning files)

## Execution Order

0. Phase 0 — Test infrastructure & guardrails
1. Item 1 (Susan Collins `incumbent: false` → `true`)
2. Item 4 (remove stale `state-rep-democratic` slug)
3. Item 7 (deduplicate source entries)
4. Item 5 (trailing newlines)
5. Item 8 (document `extends` in UBIQUITOUS-LANGUAGE.md)
6. Item 3 (document `parties[0]` assumption in comment)
7. Item 2 (link campaign websites to candidates)
8. Item 6 (fill source summaries)

## Verification

- `npm run test` passes
- `npm run build` passes (39 pages)
- `git diff` confirms only intended changes
- Pre-commit hook validates all URLs
