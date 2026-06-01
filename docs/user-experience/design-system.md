# Design System — User Experience Spoke

## Typography

- **System font stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif`
- No external font loading (zero-blocking render, fastest LCP)
- Scale:
  - `2rem` — H1 (page titles)
  - `1.5rem` — H2 (sections)
  - `1.25rem` — H3 (candidates)
  - `1rem` — Body
  - `0.875rem` — Meta, sources
  - `0.75rem` — Tags, small print

## Color Palette

| Role | Color | Hex | Ratio |
|------|-------|-----|-------|
| Body text | Black | #111 | 15.3:1 on white |
| Links | Blue | #1a56db | 4.9:1 on white |
| Subtle text | Gray | #555 | 6.5:1 on white |
| Source text | Light gray | #777 | 4.7:1 on white |
| Dem tag | Indigo bg | #e0e7ff | — |
| Rep tag | Red bg | #fee2e2 | — |
| Warning callout | Yellow bg | #fef3c7 | — |

All combinations meet WCAG AA (4.5:1 minimum).

## Spacing

- Container max-width: `48rem` (768px)
- Mobile padding: `1rem`
- Card padding: `1.25rem`
- Section margins: `1.5–2rem`

## Components

1. **Site header** — Logo/name + nav links, border-bottom
2. **Breadcrumb** — Home / Current page
3. **Race card** — Border, padding, tag, title, description — links to race page
4. **Candidate card** — Border, party tag, name, positions, source citations
5. **Comparison table** — Responsive; on mobile, collapses to stacked
6. **Ballot question pro/con** — Color-coded left borders (blue pro, red con)
7. **Fiscal impact box** — Gray background, left border
8. **Date table** — Key dates for voter resources
9. **Site footer** — Disclaimer, source links

## Responsive Breakpoints

- Default: 320px mobile
- 600px: Two-column grid
- 768px: Max-width container

## No JavaScript

All functionality works without JavaScript:
- Navigation is plain link-based
- Tables are CSS-only responsive
- No accordions, toggles, or dynamic content
- Skip-to-content link uses CSS positioning
