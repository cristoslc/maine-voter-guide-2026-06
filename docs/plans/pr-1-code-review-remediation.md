# Remediation: Code Review Findings (2026-06-03)

**Source:** `docs/ai-code-reviews/code-review-2026-06-03.md`
**PR:** #1 `ddd-refactor` → `main`
**Date:** 2026-06-03

## Summary

31 findings from 5 specialist agents: 1 critical, 9 high, 12 medium, 9 low. This plan addresses all findings that block merge (critical + high), plus selected medium/low improvements.

---

## Phases

### Phase 1: Critical Data Fix

| ID | Finding | File | Fix |
|----|---------|------|-----|
| **F1** | Copy-paste bug: `hd-122-democratic` sourcesMain includes HD-120 candidate sources | `_data/races.js:2398-2402` | Remove `source-068-campaign-website` (Jason Shedlock's HD-120 site) and `source-069-wmtw` (article about Deqa Dhalac in HD-120) from `hd-122-democratic`. Keep only `source-070-campaign-website` (Matthew Beck's site) and `source-073-maine-afl-cio-early-endorsements`. Lines 2399 and 2402 → delete. |

### Phase 2: High-Severity Fixes

| ID | Finding | File | Fix |
|----|---------|------|-----|
| **F2** | Null dereference: `posSource.url` accessed without null guard (main candidate block) | `_layouts/race.njk:65-66` | Wrap in `{% if posSource %}` guard before `.url` and `.label` access |
| **F3** | Null dereference: same pattern in cross-party race candidate block | `_layouts/race.njk:131-133` | Same fix — `{% if posSource %}` guard |
| **F4** | Null dereference: same pattern in cross-party preview fallback block | `_layouts/race.njk:157-159` | Same fix — `{% if posSource %}` guard |
| **F5** | Fragile `startsWith` matching in `resolveCandidate` | `.eleventy.js:123-126` | Replace `candidateRef.startsWith(c.name)` with `candidateRef.split(/[\(—]/)[0].trim() === c.name` or similar exact match. Or: require `candidateRef === c.name` and update race data to use exact names. |
| **F6** | `.editorconfig` missing trailing newline | `.editorconfig` | Append newline to last line |
| **F7** | New files missing POSIX trailing newlines | `test/*.test.js`, `AGENTS.md`, `UBIQUITOUS-LANGUAGE.md`, `_data/election.js`, `docs/plans/pr-1-review-fixes.md` | Ensure each ends with `\n`. Run `find . -type f \( -name '*.js' -o -name '*.md' \) -exec sed -i '' -e '$a\' {} \;` |
| **F8** | Inline CSS `style="margin:0"` contradicts CSS-first approach | `_layouts/race.njk:121,148` | Move to CSS file. Add `.candidate-head h3 { margin: 0; }` to site CSS instead |
| **F9** | 3 undocumented complex filter functions | `.eleventy.js` | Add JSDoc comments to `resolveOfficeRaw`, `collectSources`, `resolveIssue` |

### Phase 3: Medium-Severity Fixes

| ID | Finding | File | Fix |
|----|---------|------|-----|
| **F10** | `find` filter slug/id ambiguity — `(item.slug \|\| item.id) === key` | `.eleventy.js:34-37` | Consider separate `findBySlug` and `findById` filters, or document the fallback order in a comment. Add JSDoc. |
| **F11** | Dual source-rendering paths in race.njk — fallback gap | `_layouts/race.njk:167-184` | The `raceSources` (from collectSources) and `sourcesMain`/`sourcesSidebar` fallback creates two paths. Simplify: if `collectSources` returns empty but `sourcesMain` exists, the fallback renders. Document this logic. |
| **F12** | Cross-party fallback `crossPartyPreview` references legacy structure | `_layouts/race.njk:139-165` | Verify `crossPartyPreview` still works with `party` (singular) model. The `crossPartyPreview` is inline data in the race, not dependent on the filter — should be fine. Add comment noting it's inline data. |
| **F13** | Null fields in candidate data (`occupation: null`, `ballotpediaUrl: null`) | `_data/candidates.js` (multiple entries) | Remove `null` value fields — omit the key entirely when the value is null |
| **F14** | Inconsistent source ID naming convention | `_data/races.js` | Review source IDs for naming consistency (some generic like "source-068", some descriptive). Consider standardizing but low priority. |
| **F15** | Duplicate `officeSlugFromTitle` filter registration | `.eleventy.js:68 and 134` | Remove one of the two identical registrations (keep the earlier one at line 68) |
| **F16** | Filter tests re-implement logic instead of importing actual filters | `test/eleventy-filters.test.js` | Import from `.eleventy.js` via the filter registration API, or refactor `.eleventy.js` to export filter functions for testing. Document the intentional isolation choice. |
| **F17** | Test isolation gap — tests re-implement logic inline | `test/eleventy-filters.test.js` | Either export functions from `.eleventy.js` or document why tests re-implement. |
| **F18** | Party colors in `_data/parties.js` have no source attribution | `_data/parties.js` | Add source comment for color values (standard party colors) |

### Phase 4: Low-Severity Fixes

| ID | Finding | File | Fix |
|----|---------|------|-----|
| **F19** | Plans file missing trailing newline | `docs/plans/pr-1-review-fixes.md` | Add newline (covered in F7 blanket fix) |
| **F20** | Duplicate source labels `'Maine Public'` used for different source entries | `_data/sources.js` | Ensure source labels are unique enough to distinguish entries |
| **F21** | `partyTag` filter silently passes null tag through | `.eleventy.js:128-132` | Add fallback: if tag is null/undefined and no party match, return empty string instead of null |
| **F22** | Date parsing timezone issue with `new Date("2026-06-09")` | Various | Convert to ISO with timezone suffix or use explicit UTC |
| **F23** | `getEffectiveJurisdictionIds` masks data errors | `.eleventy.js:4-16` | Add comment documenting that missing jurisdiction silently returns `[jurisdictionId]` |
| **F24** | Undocumented magic values (timeouts in pre-commit hook, regex in resolveOfficeRaw) | `.githooks/pre-commit`, `.eleventy.js:84` | Add comments explaining magic values |

### Phase 5: Documentation Additions

| ID | Finding | File | Fix |
|----|---------|------|-----|
| **F25** | Module-level documentation for registry files | `_data/*.js` | Add top-level JSDoc or comments explaining each registry's purpose, required fields, and relationships |
| **F26** | `resolveOfficeRaw` 5 fallback strategies undocumented | `.eleventy.js:73-86` | Add comment documenting the fallback resolution order |
| **F27** | `collectSources` complex 4-path traversal undocumented | `.eleventy.js:144-178` | Add comment documenting the collection paths |
| **F28** | `resolveIssue` slugify-match order undocumented | `.eleventy.js:112-116` | Add comment: slugified id match takes priority over label match |
| **F29** | `resolveOffice` merge rules undocumented | `.eleventy.js:92-105` | Add JSDoc for base spread, extension override, districtNote append |
| **F30** | `slugify` function has no JSDoc | `.eleventy.js:18-23` | Add JSDoc |

---

## Prioritization for Merge

### Must-fix (blocks merge):
- F1 (critical data error)
- F2-F4 (null dereferences — broken output for some races)
- F5 (fragile matching — could match wrong candidate)
- F6 (editorconfig violates own rule)
- F7 (POSIX compliance)
- F8 (inline CSS)
- F15 (duplicate filter registration could cause unpredictable behavior)

### Should-fix (before merge):
- F9, F25-F30 (documentation — maintainability)
- F10 (filter semantics)
- F13 (clean data)
- F21 (silent null pass-through)

### Nice-to-have (can defer):
- F11, F12, F14, F16, F17, F20, F22, F23, F24, F18

---

## Test Impact

After fixes:
- **F5**: May require updating race data if candidate name matching changes
- **F13**: Removing null fields changes `_data/candidates.js` — existing tests check required fields, so null-only removals won't break them
- **F15**: Tests use inline filter implementations, so duplicate registration removal won't affect tests
- All other fixes are style/null-guard/documentation — test logic unaffected

Run `npx vitest run` and `npm run build` after each phase.