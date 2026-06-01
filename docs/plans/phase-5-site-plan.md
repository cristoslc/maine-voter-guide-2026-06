# Phase 5 — Site Emergence Plan

## Content → Page Type Mapping

| Content File | Page Type | URL | Template |
|---|---|---|---|
| content/races/us-senate.md | Race Summary | /races/us-senate/ | race |
| content/races/governor.md | Race Summary (RCV) | /races/governor/ | race |
| content/races/cd1.md | Race Summary | /races/cd1/ | race |
| content/races/state-senate-29.md | Race Summary | /races/state-senate-29/ | race |
| content/races/state-rep-sopo.md | Race Summary (multi-district) | /races/state-rep-sopo/ | race |
| content/ballot-questions/school-budget-referendum.md | Question Analysis | /ballot-questions/school-budget-referendum/ | ballot-question |
| content/pages/voter-resources.md | Info Page | /voter-resources/ | page |
| content/pages/index.md | Home Page | / | home |
| _data/election-2026-06.yml | Data file | n/a | data |

## Templates Needed

1. **base** — Shared HTML shell (meta, nav, footer)
2. **home** — Index with quick links grid
3. **race** — Race summary with candidate profiles, comparison table
4. **ballot-question** — Question analysis with pro/con, fiscal impact
5. **page** — Generic info page (voter resources)

## No JavaScript Required

- Compare/sort via CSS or server-build time
- Navigation: plain links, no hamburger
- Scannability: bold headers, short paragraphs, tables

## Design Constraints

- System font stack for speed
- High-contrast palette (WCAG AA: 4.5:1 minimum)
- 320px–1024px responsive
- No client-side JS
- 8th-grade reading level on intro text

## Step Order

1. Write journeys.md
2. Choose SSG (ADR)
3. Write design system
4. Scaffold + configure
5. Build templates
6. CI/CD + quality
7. Write spoke docs
