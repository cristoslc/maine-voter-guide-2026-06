# Code Review: PR #1 — DDD Data Model Refactor

**Reviewer**: opencode (deepseek-v4-flash)
**Date**: 2026-06-02
**PR**: #1 `ddd-refactor` → `main` (17 files, +2665/-4827)
**Recommendation**: **Needs changes** (2 data accuracy issues, several style issues)

---

## Summary

This PR refactors the election data model from a flat, duplicated structure to a DDD-style canonical registry pattern. The core idea — single-source-of-truth registries (offices, parties, issues, candidates, sources) with inheritance and FK references — is sound and significantly improves maintainability. Race deduplication (46→28 entries) via jurisdiction inheritance is the headline win.

However, there are two data accuracy issues and several style concerns that should be addressed before merge.

---

## Findings

### Critical

1. **Susan Collins `incumbent` field is wrong** (`_data/candidates.js`)
   - Susan Collins (`id: "susan-collins"`) has `"incumbent": false`. She is the sitting US Senator and is running for reelection. The old data correctly omitted the incumbent field (defaulting to the incumbent status being implicit), but since `candidates.js` is a new file, this must be set to `true`. This is a factual error in a voter guide.

2. **Several candidates missing `campaignWebsite` and `ballotpediaUrl`**
   - Of 34 candidates in `candidates.js`, only 6 have `campaignWebsite` set. While some may genuinely lack websites, several likely have them (e.g., Nirav Shah has a known campaign site `shahformaine.com` referenced in sources as `source-030` but uncoupled from the candidate record). This means the template's candidate website link will be absent for most candidates.

### Logic

3. **`findCrossPartyRace` only shows first opposing party (`_data/races.js` + `.eleventy.js`)**
   - The `findCrossPartyRace` filter returns a single opposing race (`-republican` if current is `-democratic`, or vice versa). In `race.njk`, the cross-party section then accesses `crossPartyRace.parties[0]`. This works for the current data (every race has exactly one party entry), but assumes the opposing party's candidates are always in `parties[0]`. If a race had multiple party blocks (e.g., a primary with independent cross-party preview), the logic would silently show the wrong party.

4. **`state-rep-democratic` race slug is ambiguous**
   - The old `state-rep-democratic` race slug under `jurisdiction: "south-portland"` appears to be a vestigial catch-all. South Portland has three distinct House districts (HD 120, HD 121, HD 122). The new data model preserves this generic slug alongside district-specific slugs (`hd-121-democratic`). It's unclear which race a voter in HD 120 or HD 122 would resolve to. This needs verification.

### Style

5. **Missing trailing newline at EOF** — 11 files lack final `\n`:
   - `_data/sources.js`, `_data/offices.js`, `_data/parties.js`, `_data/issues.js`, `_data/candidates.js`, `_data/geography.js`, `_data/jurisdictions.js`, `_data/ballotQuestions.js`, `_layouts/race.njk`, `_layouts/ballot-question.njk`, `content/pages/jurisdiction-home.md`

6. **Inconsistent `summary` fields** — In `sources.js`, all 106 entries have `"summary": ""` (empty string). The `Source` aggregate in `UBIQUITOUS-LANGUAGE.md` defines summary as "1-3 sentences describing what it covers and its relevance." Empty summaries defeat the purpose of the field.

7. **`source-003` and `source-004` are duplicates of `source-001`/`source-002`**
   - `source-003` ("Graham Platner campaign platform") has the same URL as `source-001` with different label. Same for `source-004` / `source-002`. The centralized registry should have deduplicated these.

### Docs

8. **UBIQUITOUS-LANGUAGE.md missing `extends` pattern documentation**
   - ARCHITECTURE.md documents the inheritance but the ubiquitous language doc doesn't mention the `extends` pattern for Office. Anyone reading the language doc to understand the data model won't find it.

---

## Synthetic Assessment

| Lens | Verdict | Key Findings |
|------|---------|-------------|
| Security | Passed | No injection vectors, no secrets, static site |
| Logic | Needs work | Cross-party assumption, ambiguous race slug, incumbent flag |
| Style | Needs work | Missing trailing newlines, empty summaries, duplicate sources |
| Docs | Warning | Missing `extends` pattern in UBIQUITOUS-LANGUAGE.md |
| Architecture | Passed | Solid DDD refactor, clean inheritance pattern |

The architectural direction is excellent. Fix the data accuracy issues (#1, #2), address the ambiguous slug (#4), and clean up style issues before merging.