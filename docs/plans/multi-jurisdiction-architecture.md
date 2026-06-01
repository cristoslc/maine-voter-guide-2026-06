# Plan: Multi-Jurisdiction Architecture

## Problem
Current architecture assumes a single jurisdiction (South Portland). User wants to support multiple jurisdictions down to city level: Portland, South Portland, Westbrook, Cape Elizabeth, Scarborough, etc.

## Requirements
- Each jurisdiction has its own set of races (state, county, city)
- Some races span multiple jurisdictions (e.g., Governor, US Senate, CD1)
- Some races are jurisdiction-specific (e.g., Portland City Council, South Portland School Board)
- URL structure should reflect jurisdiction: `/portland/races/governor-democratic/`, `/south-portland/races/state-rep-democratic/`
- Shared components (header, footer, CSS, theme toggle)
- Independent data sources per jurisdiction

## Proposed Architecture

### Option A: Single Build with Jurisdiction Prefix (Recommended)

Keep one Eleventy build. Add `jurisdiction` field to race data.

**URL Structure:**
```
/{jurisdiction}/                             # jurisdiction home
/{jurisdiction}/races/{race-slug}/           # race pages
/{jurisdiction}/ballot-questions/{slug}/     # ballot questions
/{jurisdiction}/voter-resources/               # voter resources
```

**Data Model:**
```js
// _data/races.js becomes _data/{jurisdiction}/races.js
// OR: _data/races.js contains races with jurisdiction field

race = {
  jurisdiction: "south-portland",  // "portland", "westbrook", "cape-elizabeth", etc.
  slug: "governor-democratic",
  // ... existing fields
}
```

**Eleventy Configuration:**
- Paginate races by jurisdiction
- Generate `content/{jurisdiction}/race-pages.njk` for each jurisdiction
- Or: Single `race-pages.njk` generates all races with jurisdiction-prefixed URLs

**Pros:** One build, one deploy, shared assets
**Cons:** All jurisdictions build together; can't deploy one without others

### Option B: Worktree/Dynamic Build per Jurisdiction

Each jurisdiction gets its own git branch/worktree with jurisdiction-specific data.

**Pros:** Independent deployments, jurisdiction-specific customization
**Cons:** Duplicated template/CSS code, harder to maintain consistency

### Recommended: Option A with Jurisdiction Switching

**File Structure:**
```
docs/
_data/
  races.js                    # All races, filtered by jurisdiction
  jurisdictions.js            # Metadata: name, description, elections
_layouts/
  base.html
  race.njk
  jurisdiction-home.njk       # New: per-jurisdiction home page
content/
  pages/
    index.md                  # Redirects or jurisdiction selector
    voter-resources.md
  {jurisdiction}/
    index.md                  # Per-jurisdiction home page
    race-pages.njk            # Paginated race template
    ballot-questions/
    races/                    # Could contain markdown overrides
public/css/
```

**New Data File: `_data/jurisdictions.js`**
```js
module.exports = [
  {
    slug: "south-portland",
    name: "South Portland",
    description: "City of South Portland, Maine",
    county: "Cumberland",
    stateSenateDistrict: 29,
    stateHouseDistricts: [120, 121, 122],
    electionDate: "2026-06-09",
    logo: null,
    races: [/* slugs of races this jurisdiction votes in */]
  },
  {
    slug: "portland",
    name: "Portland",
    description: "City of Portland, Maine",
    county: "Cumberland",
    stateSenateDistricts: [27, 28],
    stateHouseDistricts: [115, 116, 117, 118, 119],
    electionDate: "2026-06-09",
    logo: null,
    races: [/* ... */]
  },
  {
    slug: "westbrook",
    name: "Westbrook",
    description: "City of Westbrook, Maine",
    county: "Cumberland",
    // ...
  }
];
```

**URL Design:**
| Page | URL |
|------|-----|
| Jurisdiction selector | `/` |
| South Portland home | `/south-portland/` |
| South Portland Gov Dem | `/south-portland/races/governor-democratic/` |
| Portland Gov Dem | `/portland/races/governor-democratic/` |
| Shared CSS | `/css/style.css` |

**Jurisdiction Navigation:**
- Header nav includes jurisdiction switcher (dropdown or links)
- Current jurisdiction highlighted in header
- "Not your city?" link to jurisdiction selector

## Implementation Phases

### Phase 1: Data Restructure
1. Add `jurisdiction` field to all existing race objects in `_data/races.js`
2. Create `_data/jurisdictions.js` with South Portland metadata
3. Update `race-pages.njk` to use `{{ race.slug | prependJurisdiction(race.jurisdiction) }}`

### Phase 2: URL Restructure
1. Update all internal links to use jurisdiction-aware paths
2. Update Eleventy `permalink` generation to include jurisdiction prefix
3. Add redirects or jurisdiction selector at root `/`

### Phase 3: Portland Jurisdiction
1. Add Portland races (different state house districts, possibly city races)
2. Add Portland ballot questions
3. Generate Portland home page

### Phase 4: Additional Jurisdictions
1. Westbrook, Cape Elizabeth, Scarborough following same pattern

## Affected Files (New & Modified)
- **New:** `_data/jurisdictions.js`, `_layouts/jurisdiction-home.njk`, `content/{jurisdiction}/index.md`
- **Modified:** `_data/races.js`, `content/race-pages.njk`, `_layouts/base.html`, `content/pages/index.md`, `.eleventy.js`
- **Unchanged:** `public/css/style.css` (shared styles), `_layouts/race.njk`

## Acceptance Criteria
- [ ] Existing South Portland pages remain at `/south-portland/` URLs
- [ ] Root `/` shows jurisdiction selector or redirects
- [ ] Shared races (governor, senate) appear in multiple jurisdictions with same content
- [ ] Jurisdiction-specific races (city council) only appear in that jurisdiction
- [ ] Navigation clearly shows current jurisdiction
- [ ] Build produces all jurisdiction pages in single pass
