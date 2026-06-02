# Plan: Breadcrumbs Follow Nav IA (Home > Jurisdiction > Race)

## Problem
Current breadcrumbs on race pages are `Home » Race Title` — they skip the jurisdiction level. The site has a clear information architecture (Home → Jurisdiction → Race) but the breadcrumbs don't reflect it, so users can't navigate up to their jurisdiction from a race page.

## Current State

- `race.njk:8-10` — `Home » {{ race.title }}`
- `ballot-question.njk:6-8` — `Home » {{ title }}`
- `page.html:6-8` — `Home » {{ title }}`
- `jurisdiction-home.md` — has no breadcrumb (just hero)

## Goal
Breadcrumbs should match the actual nav IA:

| Page | Current | Target |
|------|---------|--------|
| Race page | `Home » Race` | `Home » <Jurisdiction> » Race` |
| Ballot question | `Home » Question` | `Home » <Jurisdiction> » Question` |
| Jurisdiction home | (none) | `Home » <Jurisdiction>` |
| Voter resources | `Home » Voter Resources` | (unchanged) |
| Root home | (none) | (unchanged) |

## Affected Files
- `_layouts/race.njk` — add jurisdiction link between Home and race title
- `_layouts/ballot-question.njk` — same
- `content/pages/jurisdiction-home.md` — add breadcrumb at top of page
- `_data/jurisdictions.js` — may need to look up jurisdiction name from slug

## Implementation Approach

The `race` object has `race.jurisdiction` (slug). The jurisdiction name isn't directly in the race data — it's in `_data/jurisdictions.js`. Two options:

**Option A (chosen):** Pass the full jurisdiction object into eleventyComputed. Currently `race-pages.njk` paginates over `races` with alias `race`. We can add a computed field that looks up the jurisdiction:

```yaml
eleventyComputed:
  jurisdictionName: "{{ (jurisdictions | find(race.jurisdiction)).name }}"
```

This requires a `find` filter in Eleventy (not built-in) or a custom filter in `.eleventy.js`.

**Option B:** Pre-resolve at data load time. Add a small JS hook in `.eleventy.js` that adds `jurisdictionName` to each race object before template rendering.

I'll use Option B — simpler and no custom filter needed.

## Acceptance Criteria
- [ ] Race page breadcrumb reads `Home > {Jurisdiction} > {Race Title}` and each segment is a link (except the last, which is text-only)
- [ ] Ballot question breadcrumb includes the jurisdiction
- [ ] Jurisdiction home pages have a breadcrumb `Home > {Jurisdiction}`
- [ ] Jurisdictions not in `_data/jurisdictions.js` (e.g. data typo) fall back to a "jurisdiction" placeholder rather than breaking
- [ ] Breadcrumb separators are consistent (use `›` or `>` instead of `»` to match common nav conventions)

## Styling
No CSS changes needed — existing `.breadcrumb` class handles visual presentation.
