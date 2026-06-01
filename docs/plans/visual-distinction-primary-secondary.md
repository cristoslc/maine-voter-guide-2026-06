# Plan: Stronger Primary/Secondary Visual Distinction

## Problem
Pages are visually bland. Primary content (candidate platforms/positions) and secondary content (background, controversies, polling) lack clear visual hierarchy. Sidebar boxes use subtle gray (`#f8f9fa`) which blends into the page background.

## Proposed Changes

### 1. Sidebar Styling — Stronger Contrast
- Change `.candidate-secondary` / `.race-wide-box` background from `--gray-50` to **subtle tinted background** per section type:
  - Background/controversies: `--blue-50` (light blue tint)  
  - Polling/finance: `--green-50` (light green tint)
  - Endorsements: `--purple-50` (light purple tint)
  - Debates/context: `--amber-50` (light amber tint)
- Add **left border accent** (`border-left: 3px solid`) matching the tint color
- Increase padding from `1.25rem` to `1.5rem`
- Add subtle inner shadow or distinctive border-radius

### 2. Candidate Card Header — Better Separation
- Add **horizontal rule** (`border-bottom: 2px solid var(--gray-200)`) between candidate header and body
- Increase vertical spacing between candidates (from `2.5rem` to `3.5rem`)
- Consider **slight background tint** on entire `.candidate-card` to separate it from page background

### 3. Position Blocks — Clearer Issue Stance
- `.issue-label` currently inline with text; consider **pill/badge style** or **left border color-coding**
- `.issue-text`: increase line-height for readability
- Add **visual grouping** within `.positions` — alternating subtle stripe or divider

### 4. Overall Typography & Spacing
- Increase base font size slightly (`15px` → `16px` for comfort)
- More whitespace between major sections
- Stronger headings (`h2` for race sections) with accent underline or color

### 5. Color System Enhancement
- Introduce section-type colors: blue (positions), green (polling/finance), amber (debates), purple (endorsements), red (controversies)
- Use sparingly — backgrounds and borders only, never text

## Affected Files
- `public/css/style.css` — extensive CSS changes
- `_layouts/race.njk` — may need minor class additions
- `_data/races.js` — no changes needed (data-driven)

## Acceptance Criteria
- [ ] Each sidebar section has visually distinct background tint + left border
- [ ] Position blocks are scannable with clear issue/stance separation
- [ ] Candidate cards feel like distinct units, not a continuous wall of text
- [ ] Dark mode respects the same tints (adjusted for dark backgrounds)
- [ ] Mobile: tints collapse gracefully, no horizontal overflow
