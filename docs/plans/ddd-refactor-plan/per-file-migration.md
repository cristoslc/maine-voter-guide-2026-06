# Per-File Migration

Detailed field mappings for every `_data/` file transformation, organized by migration phase.

---

## Phase 1: Foundation

### `_data/jurisdictions.js` → rewrite

| Current Field | New Field | Mapping |
|---------------|-----------|---------|
| `slug` | `id` | Direct copy |
| `name` | `name` | Direct copy |
| — | `geoRef` | Derived: `slug` → Geography.id lookup (same slug) |
| — | `geoScope` | Derived: `state-wide` → `state`, else → `municipal` |
| — | `governingBody` | Derived: `state-wide` → `state-government`, else → `municipal-government` |
| — | `type` | Dropped — replaced by geoScope on Jurisdiction + type on Geography |
| `county` | `county` | Direct copy |
| `parent` | (dropped) | Replaced by Geography hierarchy traversal |
| `stateSenateDistrict` (singular) | `stateSenateDistricts[]` | Normalized to always be array |
| `stateSenateDistricts[]` | `stateSenateDistricts[]` | Direct copy |
| `stateHouseDistricts[]` | `stateHouseDistricts[]` | Direct copy |
| `electionDate` | — | Moved to Election aggregate |
| `logo`, `description` | `description` | Keep, drop `logo` (all null) |

**Extraction query:**

```js
jurisdictions.map(j => ({ slug: j.slug, county: j.county }))
// Result: state-wide(null), south-portland(Cumberland), portland(Cumberland), cape-elizabeth(Cumberland), westbrook(Cumberland)
```

### `_data/election-2026-06.yml` → `_data/election.js`

Promote from YAML reference to consumed Eleventy data. Convert to `.js` for computed fields.

| YAML Field | New File Field | Notes |
|------------|---------------|-------|
| `election.id` | `id` | Direct |
| `election.title` | `title` | Direct |
| `election.date` | `date` | Direct, parse to Date |
| `election.type` | `type` | Direct |
| `election.jurisdiction` | — | Dropped — jurisdiction is now Geo/Jurisdiction model |
| `key-dates` | `keyDates` | Direct with field renames |
| `races` | — | Candidate registry data → moves to `candidates.js` (Phase 3) |
| `ballot-questions` | — | Already in `ballotQuestions.js` |

### `_data/races.js` → extract `_data/offices.js`

Extract distinct office definitions from all race objects. Deduplicate by `office` string.

```js
// Source extraction
const officesMap = races.reduce((acc, r) => {
  const key = r.office;
  if (!acc[key]) {
    acc[key] = {
      id: slugify(r.office),      // e.g., "governor"
      title: r.office,
      officeDesc: r.officeDesc,   // same value across all — verify identity
      jurisdiction: r.jurisdiction // from the most authoritative instance (state-wide > municipal)
    };
  }
  return acc;
}, {});
```

**Validation assertion:** For each distinct `office` value, all instances across jurisdictions must have identical `officeDesc`. Fail migration if mismatched.

### `_data/races.js` → extract `_data/parties.js`

```js
// Hardcoded registry from known party values in races and candidates
module.exports = [
  { id: "democrat", tag: "d", fullName: "Democratic Party", shortName: "Democrat", color: "#0015BC" },
  { id: "republican", tag: "r", fullName: "Republican Party", shortName: "Republican", color: "#E81B23" },
  { id: "green", tag: "g", fullName: "Green Independent Party", shortName: "Green", color: "#17A81A" },
  { id: "libertarian", tag: "l", fullName: "Libertarian Party", shortName: "Libertarian", color: "#FFD700" }
]
```

### `_data/races.js` → extract `_data/issues.js`

Extract all distinct `issue` values from `primaryContent[].issue` across all race objects, deduplicated.

**Validation:** Ensure every `issue` value in races maps to an `issues.js` entry. Flag orphans.

### `_data/geography.js` (NEW)

Construct from current jurisdiction hierarchy + new county node:

```js
module.exports = [
  { id: "maine", name: "Maine", type: "state", parent: null, aliases: ["State of Maine"] },
  { id: "cumberland-county", name: "Cumberland County", type: "county", parent: "maine", aliases: [] },
  { id: "south-portland", name: "South Portland", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "portland", name: "Portland", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "cape-elizabeth", name: "Cape Elizabeth", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "westbrook", name: "Westbrook", type: "municipality", parent: "cumberland-county", aliases: [] },
]
```

Precinct geography nodes added when precinct data is compiled (Phase 1 step 7).

### `_data/pollingLocations.js` + `_data/precincts.js` (NEW)

Extracted from the SoS 2026 Primary Voting Place Report (PDF, already sourced). Compilation approach:

```bash
rk search "polling place primary 2026 cumberland" --limit 20
rk search "precinct mapping south portland" --limit 20
```

**Fallback:** If PDF data extraction is incomplete, start with known polling locations (city clerk websites, hardcoded) and mark as `status: "draft"`. The data model supports partial data.

---

## Phase 2: Race normalization

### `_data/races.js` → rewrite

Identify duplicates:

```js
const slugCounts = races.reduce((acc, r) => {
  acc[r.slug] = (acc[r.slug] || 0) + 1;
  return acc;
}, {});
// slugs with count > 1: us-senate-democratic(4), us-senate-republican(4),
//   governor-democratic(4), governor-republican(4)
// Canonical source for deduplication: state-wide jurisdiction instance
```

New structure per race:

```js
{
  id: "governor-republican",             // was: slug
  title: "Governor — Republican Primary", // was: title
  jurisdiction: "state-wide",             // was: jurisdiction (now scoping)
  election: "2026-06-primary",            // NEW FK
  office: "governor",                     // was: office string, now FK
  party: "republican",                    // NEW FK (partisan races only)
  context: "...",                          // was: context
  voting: "...",                           // was: voting
  candidates: ["bobby-charles", ...],      // NEW FK array
  positionGroups: [                        // was: parties[0].candidates
    {
      candidate: "bobby-charles",          // was: inline name, now FK
      meta: "Leeds/Wayne · Attorney...",   // was: meta
      primaryContent: [                    // was: primaryContent
        {
          issue: "state-budget",           // was: string, now Issue FK
          text: "Proposed cutting...",     // was: text
          sourceIds: ["maine-morning-star-1"] // was: sourceUrl + sourceLabel
        }
      ],
      secondaryContent: [ /* same pattern */ ]
    }
  ],
  partyBlocks: [                           // was: parties[]
    {
      party: "republican",                 // was: party string
      candidates: ["bobby-charles", ...],   // FK, redundant but kept for clarity
      raceWideSecondary: [ /* was: raceWideSecondary */ ],
      compareTable: { /* was: compareTable */ },
      crossPartyPreview: "governor-democratic" // was: embedded content, now race slug FK
    }
  ],
  sourcesMain: ["source-1", "source-2"],   // was: inline objects, now FKs
  sourcesSidebar: ["source-3"]             // was: inline objects, now FKs
}
```

---

## Phase 3: Candidate registry

### `_data/candidates.js` (NEW)

Extracted from `election-2026-06.yml` races array + candidate names embedded in `races.js`:

```js
module.exports = [
  {
    id: "bobby-charles",
    name: "Bobby Charles",
    party: "republican",
    races: ["governor-republican", "cd1-republican"],  // cross-referenced
    incumbent: false,
    occupation: "Attorney",
    residence: "Leeds/Wayne",
    campaignWebsite: "https://...",
    ballotpediaUrl: "https://ballotpedia.org/...",
    sources: ["source-1", "source-2"]  // cross-referenced from source.races[x].candidates
  }
]
```

**Validation:** Every candidate name in `races.js` must have a corresponding entry in `candidates.js`.

---

## Phase 4: Sources registry

### `_data/sources.js` (NEW)

Extract distinct `{ sourceUrl, sourceLabel }` pairs from every `primaryContent[].sourceUrl` + `primaryContent[].sourceLabel` across all races. Assign each deduplicated URL a unique `id`, find all races and candidates that reference it.

```js
const sources = new Map();  // url → { id, url, label, races: Set, candidates: Set }
races.forEach(race => {
  race.parties.forEach(party => {
    party.candidates.forEach(candidate => {
      candidate.primaryContent.forEach(pos => {
        if (pos.sourceUrl) {
          const key = pos.sourceUrl;
          if (!sources.has(key)) {
            sources.set(key, {
              id: slugify(pos.sourceLabel || pos.sourceUrl),
              url: key,
              label: pos.sourceLabel || key,
              races: new Set(),
              candidates: new Set()
            });
          }
          sources.get(key).races.add(race.slug);
          sources.get(key).candidates.add(candidate.name);
        }
      });
    });
  });
});
```

### `_data/ballotQuestions.js` → update

Replace inline `sourceUrl` + `sourceLabel` on ballot questions with `sourceIds[]` referencing `sources.js`.