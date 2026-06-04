# PR #1 Review: Comprehensive Fix Audit

## Original PR Issues (Expanded)

The PR review flagged 8 items. Below, each is expanded beyond the reviewer's brief description to surface the full scope, then linked to its root cause.

### 1. Incumbent Flag Accuracy

**Finding:** Susan Collins `incumbent: false` (should be `true`).

**Expanded scope:** 12 additional candidates have `incumbent: false` despite being described as incumbents in race party content: Matthew Beck, Jill Duson, Rachel Talbot Ross, Samuel Zager, Matthew Moonen, Yusuf Yusuf, Michelle Boyer, Tim Nangle, Andrew Gattine, Morgan Rielly, Suzanne Salisbury, Patricia Smith, Vincent Maietta.

**Status:** Collins fixed. 12 remain.

→ **Latent error LE-1**

### 2. Campaign Website Coverage

**Finding:** 28/34 candidates missing `campaignWebsite`. Source URLs exist in `sources.js` but aren't linked.

**Expanded scope:** Three tiers:

| Tier           | Count | Description                                                                                    |
| -------------- | ----- | ---------------------------------------------------------------------------------------------- |
| Has website    | 4     | Graham Platner, Nirav Shah (fixed), Jason Shedlock (inline only), Robert Cameron (inline only) |
| Source-sourced | 11    | Known campaign URLs exist in `sources.js` — can be linked now                               |
| Unknown        | 24    | No source references — need manual research                                                   |

Source-sourced candidates: David Costello, Susan Collins, Troy Jackson, Shenna Bellows, Hannah Pingree, Angus King III, Bobby Charles, Jonathan Bush, Ron Russell, Sigrid Olson, Nirav Shah (done).

**Status:** Shah only. 38 candidates still have `campaignWebsite: null`.

→ **Latent error LE-2**

### 3. `findCrossPartyRace` Assumes `parties[0]`

**Finding:** `.eleventy.js` and `_layouts/race.njk` access `.parties[0]` without documenting or asserting that a single party block is guaranteed.

**Scope:** The assumption holds for all current data. The issue is the invariant is invisible — a future contributor adding a second party block would produce silent wrong output.

**Status:** Comment added to `.eleventy.js`. No invariant assertion. No template comment.

→ **Latent error LE-3**

### 4. State Rep Catch-All Slugs

**Finding:** `state-rep-democratic` and `state-rep-republican` called "stale catch-all" slugs under `south-portland`.

**Expanded scope:** These are not stale — they carry real candidates for districts without dedicated race pages:

- HD-120: Jason Shedlock (D), Michael J. Dougherty (R)
- HD-121: Robert Cameron (D), Meagan J. Smith (R) — also in `hd-121-*` under cape-elizabeth
- HD-122: Matthew Beck (D)

The DDD refactor created district slugs for HD-121 (under cape-elizabeth) but not HD-120 or HD-122 (under south-portland). The catch-all was left behind because the migration was incomplete, not because the model couldn't accommodate it.

**Required:** Create `hd-120-democratic`, `hd-120-republican`, `hd-122-democratic` race entries; migrate content; remove catch-alls; update candidate/source references.

**Status:** Incorrectly deferred. Model handles it — just needs content migration.

→ **Latent error LE-4**

### 5. Trailing Newlines

**Finding:** 11 files lack final `\n`.

**Status:** Fixed for all 11 files. ✓

→ **Latent error LE-5**

### 6. Source Summaries

**Finding:** All 106 (now 82) source `summary` fields empty.

**Status:** AI-generated summaries written for all 82 sources. Unverified for accuracy or nonpartisan tone.

→ **Latent error LE-6**

### 7. Duplicate Source Entries

**Finding:** `source-003`/`source-004` dupes of `source-001`/`source-002`.

**Expanded scope:** 22 additional duplicate URL pairs existed. All removed (104 → 82). However, the `JSON.stringify` rewrite and subagent rewrite lost the original file formatting (blank-line separation between entries).

**Status:** Dedup complete. Formatting regressed.

→ **Latent errors LE-7a, LE-7b, LE-12**

### 8. `extends` Inheritance Pattern

**Finding:** Missing from UBIQUITOUS-LANGUAGE.md (present in ARCHITECTURE.md but not in the domain vocabulary).

**Status:** Added. ✓

→ **Latent error LE-8**

---

## Latent Errors

For each issue, the root cause that permitted it to occur — plus critique of any suboptimal fix.

### LE-1: Dual source of truth — incumbent status in two places

**Root cause:** Incumbent status is stored in both `candidates.js` (as `incumbent: boolean`) and `races.js` party blocks (as display text like `"Matthew Beck — District 122 (Incumbent)"`). The extraction from YAML defaulted `incumbent: false` for all candidates and never cross-referenced the race-level text. No test compared the two.

**Wrong fix:** Adding a test that cross-validates — asserts the registry matches the race text. This detects divergence but keeps the duplication intact. It papers over the design flaw rather than removing it.

**Correct fix:** Eliminate the dual source. `candidates.js` is the single authority. Race candidate names are plain text ("Matthew Beck — District 122"). The template appends "(Incumbent)" during rendering by looking up the registry. No inline text encodes status.

**Implementation:**

- `_data/candidates.js`: Fix all 13 `incumbent: false` → `true`
- `_data/races.js`: Strip all `(Incumbent)` / `(incumbent)` from candidate `name` and `meta` strings
- `_layouts/race.njk`: Resolve candidate to registry entry; if `incumbent: true`, append " (Incumbent)" to rendered name
- `test/data-integrity.test.js`: Assert no race candidate name or meta contains the string "incumbent" (it belongs in the template, not the data)
- `test/data-integrity.test.js`: Migration gate — before stripping inline text, auto-discover incumbent names from race content and assert they all have `incumbent: true` in registry (proves completeness of the registry fix)

### LE-2: Data lost from inline HTML in meta strings

**Root cause:** Campaign URLs were embedded in race meta strings as HTML fragments (`<a href="https://shahformaine.com/">Campaign website</a>`). The extraction to `candidates.js` couldn't parse structured URLs from HTML. The fix for LE-1 — stripping display markup from data — exposes this same flaw: the campaign URL in `meta` is also display markup, not data. It should live in the candidate registry and be rendered by the template.

**Wrong fix:** An extraction script that parses HTML from meta strings to populate `campaignWebsite`. This treats the symptom (parse the embedded data) rather than the cause (data embedded in markup).

**Correct fix:** Same pattern as LE-1 — strip all `<a href>` tags from `meta` fields. Populate `candidates.js` `campaignWebsite` from the extracted URLs. Template generates the link markup.

**Implementation:**

- `_data/candidates.js`: Populate `campaignWebsite` for every candidate whose race `meta` contains `<a href>`
- `_data/races.js`: Strip all `<a href="...">...</a>` from `meta` strings
- `_layouts/race.njk`: If candidate resolves to a registry entry with `campaignWebsite`, render a "Campaign website" link
- `test/data-integrity.test.js`: Assert no race candidate meta contains `<a href` (HTML in data is a design error)
- `test/data-integrity.test.js`: Assert every candidate with a `<a href` in their pre-stripping meta now has `campaignWebsite` populated (migration gate)

### LE-3: Misleading data structure — `parties` is an array but always contains exactly one element

**Root cause:** The field is named `parties` (plural) and typed as an array, but each race entry represents a single party's primary — the party is encoded in the race slug (`us-senate-democratic`). The array always contains exactly one object `{party: string, candidates: [...], ...}`. The `.eleventy.js` and `race.njk` `[0]` access exploits this fact but the structure misleads any reader into thinking multiple party blocks are possible. They never are — a race IS a party primary.

**Why the structure exists:** The `parties` field was presumably designed to hold multiple party blocks for a future general-election view that hasn't been built yet. In its current form, it's a forward-looking abstraction that adds complexity without current utility. Every race slug is party-specific, so `parties` will always have one element.

**Wrong fix:** A build-time assertion that `parties.length === 1`. This documents the current invariant but doesn't fix the misleading structure.

**Correct fix — two options:**

**Option A (simple):** Rename `parties` → `party` and remove the array wrapper. Each race has a `party` object (singular), not a `parties` array. The `[0]` accesses become direct property accesses. This makes the structure reflect reality: a race IS a single party's primary. Reverses easily if a multi-party general election view is added later (wrap the object back in an array).

**Option B (forward-looking):** Keep `parties` as an array but restructure the data so that each race entry can hold multiple party blocks. This means consolidating separate race entries (`us-senate-democratic` + `us-senate-republican`) into one entry with two party blocks. This is a significant restructuring that touches the URL scheme, jurisdiction inheritance, and candidate rendering. It's the direction the original designer intended but is a Phase C-level effort.

**Recommendation:** Option A. It's minimal, correct, and reversible. If a general-election view is ever built, the refactor back to an array is trivial.

**Operator Decision:** Option A approved.

**Implementation (Option A):**

- `_data/races.js`: Rename `parties` → `party` on every race entry; remove the outer array `[]` wrapper
- `.eleventy.js`: `findCrossPartyRace` — change `crossPartyRace.parties[0]` → `crossPartyRace.party`
- `_layouts/race.njk`: Change all `race.parties[0]` → `race.party`, `crossPartyRace.parties[0]` → `crossPartyRace.party`
- `_layouts/ballot-question.njk`: Update if it accesses `parties`
- `test/data-integrity.test.js`: Update field references
- Any other template that accesses `parties`

### LE-4: Incomplete migration — catch-all slugs left behind

**Root cause:** The DDD refactor created district-specific race slugs for some districts (HD-121 under cape-elizabeth) but not all (HD-120, HD-122 under south-portland). The work shipped without a coverage audit confirming that every `candidate.races[]` entry resolved to a non-catch-all slug. The catch-all entry was a migration artifact that hid the incompleteness.

**Correct fix:** Create the missing district entries, migrate the content, then remove the catch-alls. Add a coverage test.

**Implementation:**

- `_data/races.js`: Create `hd-120-democratic`, `hd-120-republican`, `hd-122-democratic` entries under `south-portland`
- `_data/races.js`: Move HD-120/HD-122 candidate content from catch-all entries into new district entries; remove HD-121 content (already covered by `hd-121-*` under cape-elizabeth)
- `_data/races.js`: Delete `state-rep-democratic` and `state-rep-republican` entries
- `_data/candidates.js`: Update `races[]` for jason-shedlock, michael-j-dougherty, matthew-beck
- `_data/sources.js`: Update `races[]` entries referencing catch-all slugs
- `test/data-integrity.test.js`: Remove test exceptions for catch-all slugs
- `test/data-integrity.test.js`: Add coverage test — every `candidate.races[]` slug must exist in `races.js` (this would have caught the incomplete migration)

### LE-5: No POSIX compliance enforcement

**Root cause:** The project had no linter, formatter, or pre-commit check enforcing trailing newlines. Files were committed without this basic check.

**Correct fix:** `.editorconfig` with `insert_final_newline = true` — prevents the problem at the editor level. Existing test catches regressions in CI.

**Implementation:**

```
root = true
[*]
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = tab
```

### LE-6: Registry committed with empty required fields

**Root cause:** The source registry was generated by extraction but the pipeline didn't populate `summary`. The `""` default passed all checks silently because no test asserted summaries must be non-empty.

**Correct fix:** Extend the required-field validation pattern already applied to sources.js to every registry.

**Implementation:**

- `test/data-integrity.test.js`: Per-registry checks:
  - `candidates`: id, name, party (non-empty); incumbent (boolean)
  - `offices`: id, title, type, officeDesc (non-empty)
  - `parties`: id, tag, fullName, shortName, color (non-empty)
  - `issues`: id, label (non-empty)
  - `geography`: id, name, type (non-empty)
  - `jurisdictions`: id, name, slug, geoRef, geoScope (non-empty)

### LE-7a: No uniqueness constraint on source URL

**Root cause:** The extraction pipeline that generated `sources.js` didn't deduplicate by URL. Multiple runs or hand-additions created separate entries for the same URL.

**Already fixed** — the duplicate-URL test in `data-integrity.test.js` now enforces this. No further structural change needed.

### LE-7b: No formatter config preserving code conventions

**Root cause:** Data files use manual formatting (blank-line separation between entries). Programmatic `JSON.stringify` rewrites strip these conventions. No `.editorconfig` or formatter enforces consistency.

**Correct fix:** `.editorconfig` (same file as LE-5). For JS data files, add a `lint:data` script. Document convention in AGENTS.md.

**Implementation:**

- `.editorconfig`: (shared with LE-5)
- `package.json`: Add `"lint:data": "node -c _data/candidates.js && node -c _data/sources.js && node -c _data/offices.js && node -c _data/parties.js && node -c _data/issues.js && node -c _data/geography.js && node -c _data/jurisdictions.js && node -c _data/races.js"`
- `AGENTS.md`: "Data files use manual formatting with blank-line separation between entries. Use the Edit tool for changes; never do full-file `JSON.stringify(fs.writeFileSync())` rewrites."

### LE-8: Docs drift — pattern in ARCHITECTURE.md, missing from UBIQUITOUS-LANGUAGE.md

**Root cause:** ARCHITECTURE.md documented the `extends` pattern but UBIQUITOUS-LANGUAGE.md (the domain vocabulary authority) didn't. The two docs are manually maintained and drift apart.

**Correct fix:** No automated test (too fragile against doc renames). A convention in AGENTS.md is sufficient. For this specific case, a lightweight mirror check tests that `extends` targets from `offices.js` have a corresponding entry in the ubiquitous language doc.

**Implementation:**

- `AGENTS.md`: "When adding a data model pattern to ARCHITECTURE.md, also add the term to UBIQUITOUS-LANGUAGE.md under the Election Data Context table."
- `test/data-integrity.test.js`: Assert the string "extends" appears in UBIQUITOUS-LANGUAGE.md (lightweight, not fragile)

### LE-9: Tests-first sequencing skipped

**Root cause:** The plan said "Phase 0: test infrastructure" but execution jumped from vitest install directly to data fixes. No test existed proving the tests failed before the fix — they were written concurrently. No enforcement mechanism prevented skipping.

**Correct fix:** Process convention in AGENTS.md. No code-enforceable fix — this is a workflow discipline issue.

**Implementation:**

- `AGENTS.md`: "When a plan has a test phase, create the test file with at least one failing test and run `npm test` to confirm failure BEFORE making any data or code changes. Never skip from infrastructure setup to fixes."

### LE-10: Test written against known instance, not comprehensive discovery

**Root cause:** The incumbent and campaign-website tests used hardcoded singletons (`KNOWN_INCUMBENTS = {"susan-collins": ...}`, `KNOWN_CAMPAIGN_SOURCE_URLS = {"nirav-shah": ...}`). The test author populated only the instances the PR review called out. No exhaustive scan of the data was performed.

**Correct fix:** Tests that compare registries should auto-discover their comparison data from the data itself. A hand-curated "known exceptions" list may augment discovery but isn't the primary source. The migration gate approach in LE-1 and LE-2 achieves this — the test auto-discovers incumbents and campaign URLs from race content, then asserts they exist in the registry.

**Implementation:** Covered by LE-1 and LE-2 fixes. Remove `KNOWN_INCUMBENTS` and `KNOWN_CAMPAIGN_SOURCE_URLS` constants from the test file.

### LE-11: Registry built without migration of consumers

**Root cause:** The DDD refactor created `sources.js` as a new data layer but left all existing data in the old format — race party blocks still use inline `sourceUrl`/`sourceLabel` strings. The sources registry (82 entries) has zero links from `races.js` or `candidates.js`. The extraction was structural (move data to a new place) without the consumer update (change templates to read from the new place).

**Correct fix:** Complete the migration — replace inline source references with registry IDs, update templates to resolve them. Add a test that asserts no inline `sourceUrl` remains in race data after migration.

**Implementation:**

- `_data/races.js`: Replace inline `sourceUrl`/`sourceLabel` in party block positions with `sourceId` referencing `sources.js`
- `_layouts/race.njk`: Update to resolve `sourceId` → source registry entry → render link
- `test/data-integrity.test.js`: Add test "no race position has inline sourceUrl" (assert the migration is complete)

### LE-12: No regression diff before accepting subagent output

**Root cause:** Both the `JSON.stringify` dedup script and the subagent summary-writing task rewrote `sources.js` in full. Neither output was diffed against the original to verify only intended changes were made. The formatting regression was accepted without detection.

**Correct fix:** Convention in AGENTS.md. For this specific case, note in the commit that AI-written summaries need editorial review.

**Implementation:**

- `AGENTS.md`: "After a subagent returns modified file content, run `git diff -- <file>` before accepting. For AI-generated content (summaries, copy), note in the commit message that content needs human review."
- Commit message for AI summaries: "Note: source summaries are AI-generated drafts — needs editorial review for accuracy and nonpartisan tone"

---

## Remediation Plan

### Phase A: Data Fixes

| #  | Task                                                                                                                               | Files                                                                                                                          | Latent Error |
| -- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| A1 | Fix all 13 incumbent flags; strip `(Incumbent)` from race names/metas; template appends based on registry                        | `_data/candidates.js`, `_data/races.js`, `_layouts/race.njk`                                                             | LE-1         |
| A2 | Populate campaignWebsite for all `<a href>`-bearing candidates; strip `<a href>` tags from race meta; template generates links | `_data/candidates.js`, `_data/races.js`, `_layouts/race.njk`                                                             | LE-2         |
| A3 | Rename `parties` → `party` (singular, remove array wrapper); update all templates and filter code                             | `_data/races.js`, `.eleventy.js`, `_layouts/race.njk`, `_layouts/ballot-question.njk`, `test/data-integrity.test.js` | LE-3         |
| A4 | Create HD-120/HD-122 district race entries; migrate candidate content; delete catch-all slugs; update references                   | `_data/races.js`, `_data/candidates.js`, `_data/sources.js`                                                              | LE-4         |
| A5 | Review and correct all 82 AI-generated source summaries for accuracy and nonpartisan tone                                          | `_data/sources.js`                                                                                                           | LE-12        |
| A6 | Restore sources.js formatting (blank-line entry separation)                                                                        | `_data/sources.js`                                                                                                           | LE-7b        |
| A7 | Add `.editorconfig` (trailing newlines, tab indent, trim whitespace)                                                             | New `.editorconfig`                                                                                                          | LE-5, LE-7b  |
| A8 | Add `lint:data` script (syntax-check all data files) and document data-file edit convention in AGENTS.md                         | `package.json`, `AGENTS.md`                                                                                                | LE-7b        |

### Phase B: Test Infrastructure

| #  | Task                                                                                                                                                                                                                                                       | Files                           | Latent Error            |
| -- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------- |
| B1 | Write unit tests for all Eleventy filters (findCrossPartyRace, resolveOffice, resolveCandidate, effectiveJurisdictionIds, officeSlugFromTitle, resolveParty, resolveSource, resolveIssue, issueSlugFromLabel, partyTag, findBySlug, filterByJurisdictions) | `test/filters.test.js`        | Plan gap                |
| B2 | Replace singleton lookup tables with auto-discovery: incumbents from race content, campaign URLs from race meta                                                                                                                                            | `test/data-integrity.test.js` | LE-1, LE-2, LE-10       |
| B3 | Add structural invariant assertions: parties.length === 1, no "incumbent" text inline, no `<a href` in meta, no inline sourceUrl                                                                                                                         | `test/data-integrity.test.js` | LE-1, LE-2, LE-3, LE-11 |
| B4 | Add cross-entity reference integrity: candidate.races[] → real race slugs; race party candidates → registry entries                                                                                                                                      | `test/data-integrity.test.js` | LE-4                    |
| B5 | Add required-field checks for all registries (candidates, offices, parties, issues, geography, jurisdictions)                                                                                                                                              | `test/data-integrity.test.js` | LE-6                    |
| B6 | Add docs mirror check:`extends` term appears in UBIQUITOUS-LANGUAGE.md                                                                                                                                                                                   | `test/data-integrity.test.js` | LE-8                    |
| B7 | Add CI test step to `pages.yml` workflow                                                                                                                                                                                                                 | `.github/workflows/pages.yml` | Infra                   |

### Phase C: Source URL Migration

| #  | Task                                                                                           | Files                                                   | Latent Error |
| -- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ |
| C1 | Replace inline `sourceUrl`/`sourceLabel` in race party blocks with `sourceId` references | `_data/races.js`                                      | LE-11        |
| C2 | Update race.njk and ballot-question.njk templates to resolve source IDs from sources.js        | `_layouts/race.njk`, `_layouts/ballot-question.njk` | LE-11        |

### Phase D: Research

| #  | Task                                                                     | Files                                         |
| -- | ------------------------------------------------------------------------ | --------------------------------------------- |
| D1 | Research campaign websites for 24 candidates with zero source references | `_data/sources.js`, `_data/candidates.js` |

---

## Test Suite Status

```
25 tests passed — 25 total (1 test file)
└── test/data-integrity.test.js
    ├── candidates data integrity (3 tests)
    ├── sources data integrity (4 tests)
    ├── races data integrity (5 tests)
    ├── offices data integrity (1 test)
    └── lint: trailing newlines (11 tests)
```

Planned additions:

- `test/filters.test.js` — 10+ Eleventy filter unit tests
- `test/data-integrity.test.js` — ~15 new tests (auto-discovery, invariants, cross-entity integrity, required fields, docs mirror)
