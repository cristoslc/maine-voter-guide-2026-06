# ADR 0001 — Static Site Generator: Eleventy

**Status**: Accepted

**Date**: 2026-05-31

## Context

We need a static site generator (SSG) for a nonpartisan voter guide targeting South Portland, Maine voters for the June 2026 election. Requirements:

1. Static-only — no client-side JavaScript required
2. Markdown + YAML data files for content
3. Pages must load in < 2 seconds on 3G mobile
4. Templates for races, ballot questions, and info pages
5. Mobile-first responsive design
6. WCAG 2.1 AA accessibility

## Options Considered

### Eleventy (11ty)
- Node.js SSG, no client-side framework dependency
- Templates: Nunjucks, Liquid, or plain Markdown
- Data: YAML, JSON, or JavaScript files in `_data/`
- Zero client JS by default
- Builds are extremely fast (< 1s for sites our size)
- Mature ecosystem, well-documented
- Layout chaining and collections for content organization

### Astro
- Modern SSG with component-based architecture
- Strong for interactive sites; overkill for static content
- Ships client JS unless explicitly disabled
- Heavier build pipeline; islands architecture not needed here
- Better for sites that need partial interactivity

## Decision

**Eleventy** is chosen because:

1. We have zero need for client-side JavaScript — Eleventy produces pure HTML
2. Markdown + YAML is the natural input format
3. Build speed is excellent (sub-second for small content sites)
4. Template inheritance through layout chaining perfectly maps to our content types
5. The Nunjucks templating language is well-suited for comparison tables and data-driven pages
6. Minimal learning curve — content authors write Markdown, templates are straightforward
7. Eleventy produces clean HTML that passes WCAG AA with minimal effort

## Consequences

### Positive
- Simple build pipeline: `npx @11ty/eleventy`
- Content authors only need to write Markdown
- YAML data files are easy to update for each election cycle
- Fast builds on CI (seconds)
- No dependency on JavaScript frameworks — future-proof

### Negative
- No built-in hot module replacement (but `--serve` mode auto-reloads)
- Must manually configure things like sitemaps and JSON-LD (Astro has plugins)
- Template language is less expressive than JSX/Svelte components
- No built-in image optimization (can add via plugin)

## Alternatives for Future

Should the site evolve to need interactivity (e.g., candidate comparison quiz, address-based ballot lookup), Astro could be adopted. For the current scope, Eleventy is the right fit.
