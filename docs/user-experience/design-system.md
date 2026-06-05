# Design System — User Experience Spoke

## Visual Identity

**Maine Voter Guide** is a nonpartisan, civic-information tool. Its visual identity communicates:

- **Trust** — semantic color tokens decoupled from partisan hues; core palette (surfaces, body text, links, navigation) uses NO party colors
- **Neutrality** — party colors (`--party-*`) appear ONLY on UI elements rendered from data sources that carry that party's identification (candidate tags, ballot-section accents)
- **Clarity** — system font stack (no external loads), high contrast (7:1+), sans-serif body
- **Accessibility** — WCAG 2.1 AA baseline; CCD election-specific contrast standards

## Typography

- **Font stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif`
- No external font loading (zero-blocking render, fastest LCP)

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

## Semantic Color Tokens

All tokens defined in `:root`, `[data-theme="dark"]`, and `@media (prefers-color-scheme: dark)`.

### Surface tokens

| Token | Purpose | Light Value | Dark Value |
|-------|---------|------------|------------|
| `--surface-page` | Page background | `#f9fafb` | `#0d0d1a` |
| `--surface-card` | Card/panel background | `#ffffff` | `#1a1a2e` |
| `--surface-raised` | Elevated elements (header, callout) | `#1a365d` | `#0f172a` |
| `--surface-hero` | Hero banner | `#1a365d` | `#0f172a` |
| `--surface-footer` | Footer | `#111827` | `#0f172a` |
| `--surface-callout` | Informational callouts | `#fef3c7` | `#422006` |

### Content tokens

| Token | Purpose | Light Value | Dark Value |
|-------|---------|------------|------------|
| `--text-body` | Body text | `#111827` | `#f3f4f6` |
| `--text-subtle` | Meta, secondary info | `#6b7280` | `#9ca3af` |
| `--text-muted` | Source refs, labels | `#9ca3af` | `#6b7280` |
| `--text-link` | Links | `#1e40af` | `#93c5fd` |
| `--text-inverse` | Text on dark surfaces | `#ffffff` | `#ffffff` |
| `--text-accent` | Emphasized text (callout title) | `#b45309` | `#fbbf24` |

### Accent tokens

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

### Party tokens (only on data-identified party elements)

Token names use the full party `id` from `_data/parties.js` (e.g. `democrat` not `dem`). The CSS class / template helper maps `party.id` to `var(--party-${id}-*)`.

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--party-democrat-bg` | Democratic tag bg | `#dbeafe` | `#1e3a5f` |
| `--party-democrat-text` | Democratic tag text | `#1e40af` | `#93c5fd` |
| `--party-republican-bg` | Republican tag bg | `#fee2e2` | `#7f1d1d` |
| `--party-republican-text` | Republican tag text | `#b91c1c` | `#fca5a5` |
| `--party-green-bg` | Green Independent tag bg | `#dcfce7` | `#14532d` |
| `--party-green-text` | Green Independent tag text | `#15803d` | `#4ade80` |
| `--party-libertarian-bg` | Libertarian tag bg | `#fefce8` | `#422006` |
| `--party-libertarian-text` | Libertarian tag text | `#a16207` | `#fbbf24` |
| `--party-inc-bg` | Incumbent tag bg (any party) | `#f0fdf4` | `#14532d` |
| `--party-inc-text` | Incumbent tag text (any party) | `#15803d` | `#4ade80` |

### Label tokens (race card tags — nonpartisan visual signaling)

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--label-primary-bg` | "Partisan" race label bg | `#dbeafe` | `#1e3a5f` |
| `--label-primary-text` | "Partisan" race label text | `#1e40af` | `#93c5fd` |
| `--label-contested-bg` | "Contested" race label bg | `#fef2f2` | `#7f1d1d` |
| `--label-contested-text` | "Contested" race label text | `#b91c1c` | `#fca5a5` |
| `--label-uncontested-bg` | "Uncontested" race label bg | `#f3f4f6` | `#1f2937` |
| `--label-uncontested-text` | "Uncontested" race label text | `#6b7280` | `#9ca3af` |
| `--label-referendum-bg` | "Referendum" label bg | `#dcfce7` | `#14532d` |
| `--label-referendum-text` | "Referendum" label text | `#15803d` | `#4ade80` |

## Nonpartisan Visual Signaling

- **Race card tags**: `.card-tag.partisan` uses `--label-primary-bg` (neutral blue). Party distinction handled by `.party-tag.[d|r|g|l]` inside the card — never by the card-level label.
- **Hero**: Solid dark background (`--surface-hero`), no party colors.
- **Section headers**: Ballot section `<h2>` elements get 3px left-border accent based on party (Democratic → `--party-democrat-text`, Republican → `--party-republican-text`, All Voters → `--accent-primary`). Applied only to data-driven classes `.section-democratic`, `.section-republican`, `.section-all-voters`.

## Spacing

- Container max-width: `60rem` (960px)
- Mobile padding: `1rem`
- Card padding: `1.25rem`
- Section margins: `1.5–2rem`

## Components

1. **Site header** — Dark background, sticky, nav links + theme toggle
2. **Skip link** — First focusable element, visible on focus
3. **Breadcrumb** — Home / Current page, text-subtle color
4. **Race card** — Link card with label tags, title, voting instruction
5. **Candidate card** — Party tag, positions, source citations, comparison areas
6. **Comparison table** — Responsive: collapses to stacked cards on mobile
7. **Ballot question pro/con** — Color-coded top borders (green/red)
8. **Calendar** — Event grid with color-coded days and legend
9. **Date table** — Key dates with highlight for current period
10. **Site footer** — Dark background, disclaimer, source links

## Responsive Breakpoints

- Default: 320px mobile
- 600px: Two-column grid
- 768px: Full max-width

## No JavaScript

All functionality works without JavaScript — navigation is link-based, tables are CSS-only responsive, no dynamic content.