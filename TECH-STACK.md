# Tech Stack

Overview of language, framework, and infrastructure decisions. Detail lives in `docs/tech-stack/`.

## Language & Runtime

- **Static site generator** — to be determined (likely Eleventy or Astro)
- **Content format** — Markdown + YAML data files
- **Deployment** — Static hosting (Cloudflare Pages, Netlify, or GitHub Pages)

## Research Pipeline

- **research-keeper** (`rk`) — Agent-native research library (Python). Adds sources (URLs, PDFs, videos, notes), auto-tags, synthesizes by theme. Lives at `~/code/research-keeper/`. Project library instance: `~/projects/boswell/`. CLI: `rk add`, `rk resolve`, `rk search`, `rk investigate`, `rk research`.
- **media-summary** skill — Downloads and summarizes media (YouTube, podcasts, X threads, web articles) into structured markdown. Lives at `~/Documents/code/media-summary/`. Publishes to GitHub Gists.
- **Upstream data** — Existing research from `south-portland-school-board-review`, `south-portland-school-budget-FY27`, and `sopo-alpr-awareness` projects, all backed by shared `boswell` research library.

## Infrastructure

- **CI/CD** — GitHub Actions or Forgejo Actions
- **DNS** — To be determined
- **Analytics** — Privacy-respecting (e.g., Fathom, Plausible, or none)

## Rationale

See `docs/adr/` for decision records on tech choices.

## Spokes

- `docs/tech-stack/frontend.md` — SSG, templates, styling
- `docs/tech-stack/content.md` — Data formats, content pipeline
- `docs/tech-stack/infrastructure.md` — Hosting, CI/CD, DNS