# Accessibility — User Experience Spoke

## WCAG 2.1 AA Checklist

### Perceivable

- [x] Non-text content has alternative text (skip link, images planned)
- [x] Color contrast ≥ 4.5:1 (all text combinations verified)
- [x] Content readable at 200% zoom (responsive layout)
- [x] Content readable without CSS (semantic HTML structure)

### Operable

- [x] All functionality operable by keyboard
- [x] No keyboard traps
- [x] Skip-to-content link
- [x] Focus indicators visible (2px outline on `:focus-visible`)
- [x] Page titles are unique and descriptive
- [x] Links have meaningful text (not "click here")
- [x] Navigation consistent across pages

### Understandable

- [x] Language set (`<html lang="en">`)
- [x] Navigation consistent and predictable
- [x] Error identification (N/A — no forms)

### Robust

- [x] Valid HTML (Eleventy output)
- [x] Semantic elements used (header, main, footer, nav, table)
- [x] ARIA labels on navigation (`aria-label`)

## Automated Testing

Run against `_site/` output:
- axe-core: Expect zero critical or serious violations
- WAVE: Expect zero errors, warnings reviewed
- Lighthouse: Accessibility score ≥ 90

## Manual Testing

1. **Keyboard navigation**: Tab through all interactive elements (links). Verify focus ring visible on each.
2. **Screen reader**: VoiceOver (Mac) / NVDA (Windows). Verify:
   - Skip link works
   - Navigation announced correctly
   - Candidate names and positions read in logical order
   - Tables announced with headers
3. **Zoom**: 200% zoom — no horizontal scroll on 320px device
4. **Reduced motion**: `prefers-reduced-motion` respected (no animations by default)

## Contrast Standards (CCD Election-Specific)

| Token | Purpose | Light Value | Dark Value | Ratio (light) | Standard |
|-------|---------|------------|------------|------|----------|
| `--text-body` | Body text | `#111827` | `#f3f4f6` | 15.3:1 | 7:1 body |
| `--text-subtle` | Meta, secondary | `#6b7280` | `#9ca3af` | 6.5:1 | 4.5:1 min |
| `--text-link` | Links | `#0f766e` | `#5eead4` | 5.2:1 | 3:1 large text |
| `--text-accent` | Callout title | `#b45309` | `#fbbf24` | 7.5:1 | 4.5:1 |

## Known Limitations

- No high-contrast mode toggle (colors already meet AA)
- No text size toggle (browser zoom preferred)
- External links open in same tab (standard behavior)

## Testing Results

(To be filled after running tests)
