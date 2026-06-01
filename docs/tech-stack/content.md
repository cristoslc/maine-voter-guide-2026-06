# Content Pipeline — Tech Stack Spoke

## Content Types

| Type | Directory | Format | Layout |
|------|-----------|--------|--------|
| Race Summaries | `content/races/` | Markdown + YAML frontmatter | race |
| Ballot Question Analyses | `content/ballot-questions/` | Markdown + YAML frontmatter | ballot-question |
| Info Pages | `content/pages/` | Markdown + YAML frontmatter | page |
| Home Page | `content/pages/index.md` | Markdown + YAML frontmatter | home |

## Data Files

| File | Purpose | Format |
|------|---------|--------|
| `_data/election-2026-06.yml` | Structured election data | YAML |

## Frontmatter Schema

```
---
layout: race|ballot-question|page|home
title: "Page Title"
permalink: /url-path/
---
```

## Content Pipeline Flow

1. Research (Phase 3) produces `docs/sources/research-syntheses.md`
2. Sources referenced in content files with inline citations
3. Markdown files written to `content/`
4. `npm run build` → Eleventy renders HTML
5. Output in `_site/`

## Content Freshness

- All content files include a `_Last updated: YYYY-MM-DD_` footer
- The voter guide should be refreshed before each election
- Sources should be rechecked before publication
