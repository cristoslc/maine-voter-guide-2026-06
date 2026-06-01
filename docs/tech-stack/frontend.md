# Frontend — Tech Stack Spoke

## Static Site Generator

**Eleventy (11ty)** v3. See ADR 0001 for rationale.

### Configuration
- Input: `content/`
- Output: `_site/`
- Data: `_data/` (YAML)
- Layouts: `_layouts/`
- Includes: `_includes/`
- Static assets: `public/`

### Templates
| Template | Layout | Purpose |
|----------|--------|---------|
| `base.html` | — | HTML shell, nav, footer |
| `home.html` | base | Home page with race grid |
| `race.html` | base | Race summary + candidate profiles |
| `ballot-question.html` | base | Ballot question analysis |
| `page.html` | base | Info pages (voter resources) |

### Styling
- `public/css/style.css` — Single stylesheet
- System font stack, no external fonts
- Mobile-first responsive (320px breakpoint)
- High-contrast palette (meets WCAG AA)
- No CSS framework dependency

### Design Decisions
- No client-side JavaScript
- Clean HTML output, readable without CSS
- Print stylesheet included
- Skip-to-content link for keyboard nav
