# Plan: Visual Identity for the Maine Voter Guide

## Motivation

The site currently has colors, typography, and layout patterns but no documented, coherent visual identity. The `civic-visual-identity` trove research reveals gaps in semantic naming, nonpartisan signaling, and accessibility-first color standards. This plan establishes a written identity and applies it to the CSS, templates, and content.

---

## 1. Visual Identity Statement

**Maine Voter Guide** is a nonpartisan, civic-information tool. Its visual identity communicates:

- **Trust** — dark blue anchor, consistent spacing, predictable navigation
- **Neutrality** — semantic color tokens decoupled from partisan hues; the core palette (surfaces, body text, links, navigation) uses NO party colors. Party colors (`--party-*`) appear ONLY on UI elements rendered from data sources that carry that party's identification (candidate tags, race ballot-section accents).
- **Clarity** — system font stack (no external loads), high contrast (7:1+), sans-serif body
- **Accessibility** — WCAG 2.1 AA baseline; CCD election-specific contrast standards (7:1 body, 3:1 large text, 15:1 shaded boxes)

---

## 2. Semantic Color Token System (Replace Hue-Based Names)

### Current problem

Tokens like `--blue`, `--blue-dark`, `--gold`, `--red` encode hue, not purpose. A voter guide that uses `--blue` for both "Democratic party tag" and "hero background" and "link color" has lost semantic meaning, making theming and dark-mode maintenance harder. Party colors also leak into non-party elements — the hero, links, and navigation all use blue, visually associating the site's core identity with one party.

### New token architecture

#### Surface tokens (what elements use)

| Token | Purpose | Light Value | Dark Value |
|-------|---------|------------|------------|
| `--surface-page` | Page background | `#f9fafb` | `#0d0d1a` |
| `--surface-card` | Card/panel background | `#ffffff` | `#1a1a2e` |
| `--surface-raised` | Elevated elements (header, callout) | `var(--primary-dark)` | `#0f172a` |
| `--surface-hero` | Hero banner | `var(--primary-dark)` | `#0f172a` |
| `--surface-footer` | Footer | `#111827` | `#0f172a` |
| `--surface-callout` | Informational callouts | `#fef3c7` | `#422006` |

#### Content tokens

| Token | Purpose | Light Value | Dark Value | Contrast on `--surface-page` |
|-------|---------|------------|------------|------|
| `--text-body` | Body text | `#111827` | `#f3f4f6` | 15.3:1 |
| `--text-subtle` | Meta, secondary info | `#6b7280` | `#9ca3af` | 6.5:1 |
| `--text-muted` | Source refs, labels | `#9ca3af` | `#6b7280` | 4.7:1 |
| `--text-link` | Links | `#1e40af` | `#93c5fd` | 4.9:1 |
| `--text-inverse` | Text on dark surfaces | `#ffffff` | `#ffffff` | — |
| `--text-accent` | Emphasized text (callout title) | `#b45309` | `#fbbf24` | 7.5:1 |

#### Accent tokens (for borders, tags, decoration)

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--accent-primary` | Primary accent (borders, links hover) | `#1e40af` | `#93c5fd` |
| `--accent-warm` | Warning/info accent | `#b45309` | `#fbbf24` |
| `--accent-success` | Incumbent, approved | `#15803d` | `#4ade80` |
| `--accent-danger` | Error, deadline | `#b91c1c` | `#fca5a5` |
| `--accent-subtle-bg` | Subtle background tint (blue) | `#eff6ff` | `#0f172a` |
| `--accent-warm-bg` | Subtle background tint (amber) | `#fffbeb` | `#422006` |
| `--accent-good-bg` | Subtle background tint (green) | `#f0fdf4` | `#14532d` |
| `--accent-bad-bg` | Subtle background tint (red) | `#fef2f2` | `#7f1d1d` |

#### Partisan-specific tokens (only for party-identified data objects)

These tokens MUST ONLY appear on UI elements rendered from data sources that carry an `id` matching the party key in `_data/parties.js`. Every party in the registry gets a token pair (`--party-{id}-bg`, `--party-{id}-text`). The party-independent `--party-inc-*` tokens cover the "incumbent" label (which is metadata, not party).

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--party-democrat-bg` | Democratic tag background | `#dbeafe` | `#1e3a5f` |
| `--party-democrat-text` | Democratic tag text | `#1e40af` | `#93c5fd` |
| `--party-republican-bg` | Republican tag background | `#fee2e2` | `#7f1d1d` |
| `--party-republican-text` | Republican tag text | `#b91c1c` | `#fca5a5` |
| `--party-green-bg` | Green Independent tag background | `#dcfce7` | `#14532d` |
| `--party-green-text` | Green Independent tag text | `#15803d` | `#4ade80` |
| `--party-libertarian-bg` | Libertarian tag background | `#fefce8` | `#422006` |
| `--party-libertarian-text` | Libertarian tag text | `#a16207` | `#fbbf24` |
| `--party-inc-bg` | Incumbent tag background (any party) | `#f0fdf4` | `#14532d` |
| `--party-inc-text` | Incumbent tag text (any party) | `#15803d` | `#4ade80` |

Token names use the full party `id` from the registry (e.g. `democrat` not `dem`) for clarity. The CSS class / template helper maps `party.id` to `var(--party-${id}-*)`.

**Enforcement**: No `--party-*` token may appear in a CSS selector that targets a non-party-identified element. A visual diff or audit should confirm: if an element carries a party token, its data source must have that party's `id`.

#### Neutral semantic label tokens (for race card tags — non-partisan visual signaling)

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--label-primary-bg` | "Partisan" race label | `#dbeafe` | `#1e3a5f` |
| `--label-primary-text` | "Partisan" race label text | `#1e40af` | `#93c5fd` |
| `--label-contested-bg` | "Contested" race label | `#fef2f2` | `#7f1d1d` |
| `--label-contested-text` | "Contested" race label text | `#b91c1c` | `#fca5a5` |
| `--label-uncontested-bg` | "Uncontested" race label | `#f3f4f6` | `#1f2937` |
| `--label-uncontested-text` | "Uncontested" race label text | `#6b7280` | `#9ca3af` |
| `--label-referendum-bg` | "Referendum" / ballot label | `#dcfce7` | `#14532d` |
| `--label-referendum-text` | "Referendum" / ballot label text | `#15803d` | `#4ade80` |

### Migration path

1. Add new semantic tokens above the existing hue-based ones in `:root {}`
2. Replace all CSS property references — `var(--blue)` → `var(--accent-primary)`, `var(--blue-dark)` → `var(--surface-raised)`, etc.
3. Keep the old hue-based token names defined as aliases during migration
4. After all selectors are migrated, remove the alias tokens and the old `--tint-*` variables

This is the highest-impact change. It must be done carefully (one CSS file, no JS build step).

---

## 3. Typography Baseline

The current system font stack is already best-practice per USWDS. Document and lock it.

**Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif`

**Scale** (current, documented in design-system.md but not in CSS comments):

| Level | Size | Weight | Line Height | Used For |
|-------|------|--------|-------------|----------|
| Display | 1.5rem | 700 | 1.15 | Hero title |
| H1 | 1.75rem | 700 | 1.25 | Page titles |
| H2 | 1.25rem | 700 | 1.3 | Section headers |
| H3 | 1.125rem | 600 | 1.35 | Candidate names, card titles |
| H4 | 1rem | 600 | 1.4 | Sub-section headers |
| Body | 1rem | 400 | 1.6 | Paragraphs |
| Small | 0.875rem | 400 | 1.5 | Meta, source refs |
| Tag | 0.6875rem | 700 | 1.3 | Card tags, party tags, uppercase |
| Tiny | 0.75rem | 400 | 1.4 | Small print, footer text |

**Add to plan**: Document this scale in CSS comments and in the design-system.md file.

---

## 4. Nonpartisan Visual Signaling

### Card tags (race cards)

Current: `.card-tag.partisan` uses `--blue-light` (same as Democratic tag). This creates visual confusion — a "Partisan" label on a Republican race card still looks blue.

**Fix**: Use a neutral accent for "Partisan" label — `--label-primary-bg` (still uses blue, but renamed semantically). The party distinction is handled by `.party-tag.d` / `.party-tag.r` inside the card, not by the card-level label.

### Hero

The solid `--primary-dark` background is a good nonpartisan choice, already fixed. No change needed.

### Section headers

Current: section headers "Democratic Primary Ballot" / "Republican Primary Ballot" and "All Voters" have no visual distinction beyond the text. Consider adding a subtle left-border accent per section:

- **Democratic**: 3px left border `var(--party-democrat-text)`
- **Republican**: 3px left border `var(--party-republican-text)`
- **All Voters**: 3px left border `var(--accent-primary)`

This provides subtle visual orientation without dominating the page. The party-colored borders are only applied to `<h2>` elements that carry a `.section-democratic` or `.section-republican` class — i.e., they are rendered from data that identifies the ballot section's party.

---

## 5. Design System Documentation Update

The current `docs/user-experience/design-system.md` needs to be updated to:

1. Include the visual identity statement (from §1 above)
2. Replace the flat color table with the semantic token system
3. Add the typography scale table
4. Document the nonpartisan visual signaling strategy
5. Add a "Tone of voice" section — short, factual, nonpartisan language standards

---

## 6. Warrants

Each warrant is a small, reviewable, deployable PR branching from `feat/visual-identity`. Dependencies use GitHub's PR body marker `Depends on #N`.

### W1 — Token Definitions
**Branch:** `feat/visual-identity/token-defs` | **Files:** `public/css/style.css` (~30 lines added)

- Add `--surface-*`, `--text-*`, `--accent-*`, `--party-*` (4 parties + inc), `--label-*` tokens to `:root`
- Add same to `[data-theme="dark"]`
- Add same to `@media (prefers-color-scheme: dark)`
- Add typography scale CSS comments

Zero-risk: purely additive, no selector changes.

### W2 — Navigation / Header Selector Migration
**Branch:** `feat/visual-identity/nav-header` | **Files:** `public/css/style.css` (~30 selectors) | **Depends on:** W1

Replace `var(--blue-dark)` / `var(--blue)` in `.site-header`, `.nav`, `.nav-link`, `.mobile-menu`, `.header-anchor`, `.breadcrumb` selectors with `var(--surface-raised)` / `var(--text-inverse)`.

### W3 — Hero + Page Chrome Selector Migration
**Branch:** `feat/visual-identity/hero-chrome` | **Files:** `public/css/style.css` (~20 selectors) | **Depends on:** W1

Replace hue tokens in `.hero`, `.hero-title`, `.hero-subtitle`, `.content-container`, `.main-content` selectors.

### W4 — Race Card Selector Migration
**Branch:** `feat/visual-identity/race-cards` | **Files:** `public/css/style.css` (~40 selectors) | **Depends on:** W1

Replace hue tokens in `.race-card`, `.card-tag.*`, `.party-tag.*` selectors. Apply `--label-*` tokens on card-level labels, `--party-*` tokens only on `.party-tag.[d|r|g|l]`.

### W5 — Candidate Detail Selector Migration
**Branch:** `feat/visual-identity/candidate-detail` | **Files:** `public/css/style.css` (~30 selectors) | **Depends on:** W1

Replace hue tokens in `.candidate-detail`, `.candidate-name`, `.candidate-party`, `.candidate-bio`, related selectors.

### W6 — Footer + Utility Selector Migration
**Branch:** `feat/visual-identity/footer-utilities` | **Files:** `public/css/style.css` (~20 selectors) | **Depends on:** W1

Replace hue tokens in `.site-footer`, `.footer-*`, `.utility-*` selectors.

### W7 — Tables, Tags, Labels Selector Migration
**Branch:** `feat/visual-identity/tables-tags` | **Files:** `public/css/style.css` (~40 selectors) | **Depends on:** W1

Replace hue tokens in `.date-table`, `.highlight`, `.tag-*`, `.label-*` selectors. Replace `--blue-lighter` with semantic equivalent in `.date-table .highlight td`.

### W8 — Section Border Accents
**Branch:** `feat/visual-identity/section-borders` | **Files:** `public/css/style.css`, `content/pages/jurisdiction-home.md` (~15 selectors + 3 template lines) | **Depends on:** W1

Add `.section-democratic` (left border `--party-democrat-text`), `.section-republican` (left border `--party-republican-text`), `.section-all-voters` (left border `--accent-primary`). Update `jurisdiction-home.md` H2 elements with matching classes.

### W9 — Party Token Audit
**Branch:** `feat/visual-identity/party-audit` | **Depends on:** W4, W5, W8

Audit all `--party-*` token usage: confirm none appear on elements without party-identified data sources. Fix any violations.

### W10 — Cleanup
**Branch:** `feat/visual-identity/cleanup` | **Files:** `public/css/style.css` (~10 lines removed) | **Depends on:** W2, W3, W4, W5, W6, W7

Remove old hue-based token aliases, `--tint-*` variables, and unused `--blue-lighter`. Only safe after all migration warrants are merged.

### W11 — Documentation
**Branch:** `feat/visual-identity/docs` | **Files:** `docs/user-experience/design-system.md`, `docs/user-experience/accessibility.md`, `UBIQUITOUS-LANGUAGE.md` | **Depends on:** W1

Update design-system.md with full visual identity and token tables. Update accessibility.md contrast standards. Add visual identity terms to UBIQUITOUS-LANGUAGE.md.

### Dependency Graph

```
W1 ──┬── W2 (nav/header)
     ├── W3 (hero/chrome)
     ├── W4 (race cards) ──┐
     ├── W5 (candidate) ───┤
     ├── W6 (footer/util)  │
     ├── W7 (tables/tags) ─┘
     ├── W8 (section borders) ──┐
     └── W10 (cleanup) ← W2+W3+W4+W5+W6+W7
     └── W11 (docs)

W9 (party audit) ← W4+W5+W8  (can run after those merge)
```

W2–W7 and W11 can all start in parallel once W1 merges. W9 blocks on W4+W5+W8. W10 must be last in the migration chain.

---

## 7. Open Questions for the User

1. **Favicon** — Should we create a simple favicon (grid icon, ballot-box emoji, or text "MVG")?
2. **Hero illustration** — CCD offers a library of civic icons. Worth adding a subtle pattern or illustration below the hero text?
3. **Print identity** — The current print styles strip all branding (hero bg, colors). Should print output retain a subtle header or watermark?
4. **Jurisdiction colors** — Each city page (South Portland, Portland, Cape Elizabeth, Westbrook) currently uses identical `--primary-dark`. Should each get a distinct accent color, or keep them uniform?
