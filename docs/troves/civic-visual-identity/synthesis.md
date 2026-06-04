# Trove: civic-visual-identity

Research on visual identity, design systems, and accessibility guidelines for civic tech and nonpartisan voter guides.

## Tags

civic-tech, visual-identity, voter-guide, design-system, accessibility, color-palette, typography, nonpartisan, election-design, WCAG

## Sources

| # | Source | Type | Date | Description |
|---|--------|------|------|-------------|
| 1 | CCD Voter Guide Design | web-page | 2026-06-04 | Center for Civic Design — fonts, color palette (7:1/3:1/15:1 contrast), templates, content ordering |
| 2 | CCD Voter Education Toolkit | web-page | 2026-06-04 | Bite-snack-meal framework for scalable voter education across formats |
| 3 | USWDS Color Utilities | documentation-site | 2026-06-04 | Federal design system — token-based color architecture, semantic naming, "magic number" contrast |
| 4 | Maxiom Civic Design Systems | web-page | 2026-06-04 | Quantified benefits of civic design systems (50% faster rollouts, 124% improved success) |
| 5 | Accessible Fonts Guide | web-page | 2026-06-04 | WCAG/ADA typography guidelines — font choice, size, spacing, contrast |

## Key Findings

### 1. Color palette must be accessibility-first

**Agreement across all sources:** Election/civic materials require significantly higher contrast than general web content.

- **Center for Civic Design** specifies:
  - **7:1 contrast** — any size text on white, or as background for white letters
  - **3:1 contrast** — large text (16pt+)
  - **15:1 contrast** — shaded boxes with black text
  - [Downloadable PDF palette](https://civicdesign.org/wp-content/uploads/2016/02/CCD-Elections-Color-Palette-20160331.pdf) with pre-tested combinations

- **USWDS** demonstrates a systematic approach:
  - Semantic color naming (`primary`, `secondary`, `accent-warm`) rather than hue-based names
  - Grades 5–90 per family with `vivid` variants
  - "Magic number" of 40+ grade difference ensures AA compliance
  - This makes compliance auditable and repeatable

### 2. Typography: sans-serif, 16px minimum, system fonts

**Agreement:** Simple sans-serif fonts are the standard for civic materials.

- CCD recommends: Arial, Helvetica, Univers, Verdana, Calibri, Google Noto Sans, ClearviewADA
- USWDS uses a system font stack for performance and familiarity
- Accessibility guidelines: 16px minimum body text, adequate line spacing, distinguishable characters (i/l/L/1)
- Research: proper typography improves reading accuracy by 20% and reduces eye strain by 30%

### 3. Content structure: civics first, ballot second

**CCD finding from voter studies:** Keeping civics information together toward the front and ballot-related information in the second half worked well for people.

This suggests a two-part information architecture:
1. **Front matter** — election date, ways to vote, polling locations, how to mark ballot
2. **Ballot content** — races, candidates, ballot questions

### 4. Scalable format strategy (bite-snack-meal)

The voter education toolkit uses a tiered content framework:
- **Bite** — social media, quick facts
- **Snack** — flyers, postcards
- **Meal** — full voter guide, booklet

A voter guide website serves as the "meal" that can be decomposed into "snacks" (race cards, candidate summaries) and "bites" (shareable graphics, key dates).

### 5. Nonpartisan visual signaling

Implicit across sources:
- Avoid red/blue as primary palette (partisan association)
- Use neutral or civic-oriented colors (blues, greens, ambers that don't map to party branding)
- CCD's palette uses a range of colors including golds, greens, purples — not just red and blue
- USWDS uses semantic roles (`primary`, `secondary`, `accent`) decoupled from political meaning

## Points of Agreement

1. **Accessibility is not optional** — all sources treat WCAG AA as baseline, with some (VVSG) requiring 10:1 for ballots
2. **Plain language** — simplify jargon, use consistent labels, include progress indicators
3. **Test with real users** — especially those with disabilities, across devices and network conditions
4. **Mobile-first** — civic materials must work on phones (320px minimum)

## Points of Disagreement / Trade-offs

| Topic | Position A | Position B |
|-------|-----------|-----------|
| Serif vs. sans-serif | Sans-serif is more accessible (CCD, most sources) | Research is inconclusive; either works if well-designed (DigitalA11Y) |
| Custom fonts | Use election-specific fonts like ClearviewADA (CCD) | Use system font stacks for performance (USWDS) |
| Color richness | Use multiple colors for visual interest (CCD palette) | Limit to 2-color palette for consistency (nonprofit branding advice) |

## Gaps

- No source addresses how to visually distinguish **Democratic** vs. **Republican** primary ballot sections without using red/blue party colors
- No source covers **dark mode** considerations for election materials
- No source specifically addresses **local jurisdiction branding** (city/town-specific visual identity)
- CCD materials are print-oriented; web-specific voter guide patterns are less documented

## Recommendations for Maine Voter Guide

1. **Color audit** — test current palette (`--blue-dark: #1a365d`, `--blue: #1e40af`) against CCD's 7:1 and 15:1 standards. The blue-on-white combination likely passes, but verify with a contrast checker.

2. **Consider semantic color tokens** — instead of `--blue`, `--gold`, `--red`, use `--primary`, `--accent-warm`, `--success`, `--error` to decouple from political associations.

3. **Font stack** — the current `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...` stack aligns with USWDS best practices. Keep it.

4. **Hero treatment** — the solid `var(--blue-dark)` background we just switched to is a good nonpartisan choice. Avoid gradients that might introduce partisan color blending associations.

5. **Card/race visual distinction** — consider using neutral semantic labels (`partisan` tags with subtle color coding) rather than strong red/blue cards. The current `--blue-light` (#dbeafe) for partisan tags is appropriately subtle.

## Related Troves

- `voter-guide-landscape` — exemplar voter guides and data models
