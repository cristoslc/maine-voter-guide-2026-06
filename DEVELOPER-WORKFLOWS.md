# Developer Workflows

Build, test, and deploy instructions. Detail lives in `docs/developer-workflows/`.

## Research Pipeline

Candidate and issue research flows through `research-keeper` (`rk`) and the `media-summary` skill before becoming editorial content.

### Ingest a candidate source (website, video, speech)

```bash
# Add a URL to the boswell research library
cd ~/projects/boswell
rk add "https://candidate-website.example.com"

# Add a video (debate, speech, ad)
rk add "https://www.youtube.com/watch?v=VIDEO_ID"

# Add a note from in-person observation
rk add "note:Observed candidate X at forum on 2026-03-15..."

# Process sidecars (agent fills in tags/syntheses, then)
rk resolve
```

### Research a topic

```bash
# Start an investigation thread
rk investigate "school-board-candidate-positions"

# Multi-step research exploration
rk research "South Portland city council candidates 2026"

# Semantic search across all sources
rk search "affordable housing policy position"
```

### Media ingestion (via media-summary skill)

When the `media-summary` skill is invoked (via opencode or Claude Code), it:
1. Classifies the source (YouTube, X thread, web article, podcast)
2. Acquires transcript (subtitles, Whisper, OCR, readability)
3. Generates structured markdown summary
4. Publishes to GitHub Gist

The resulting summary can be added to `rk` for ongoing research.

### Upstream project data

Existing research from related projects can be imported:

```bash
# Import from school-board-review or school-budget-FY27
rk import-trove <manifest-file>
rk import-rk <path-to-other-rk-instance>
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Open in browser
open http://localhost:8080
```

## Build

```bash
npm run build
```

Output goes to `_site/` (or equivalent based on SSG choice).

## Test

```bash
# Lint content and templates
npm run lint

# Check links
npm run test:links

# Full test suite
npm test
```

## Deploy

```bash
# Preview production build locally
npm run preview

# Deploy to production (CI handles this on main branch push)
npm run deploy
```

## Key Dates for This Project

| Milestone | Date |
|-----------|------|
| Content freeze | TBD |
| Site launch | TBD |
| Election day | June 2026 |

## Spokes

- `docs/developer-workflows/setup.md` — Environment setup, prerequisites
- `docs/developer-workflows/content-pipeline.md` — How content flows from data to published page
- `docs/developer-workflows/ci-cd.md` — Pipeline configuration