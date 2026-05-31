# User Experience

UX principles, journeys, and accessibility targets. Detail lives in `docs/user-experience/`.

## UX Principles

1. **Nonpartisan** — Present facts, not opinions. Pro/con format for ballot questions.
2. **Fast** — Pages load in under 2 seconds on mobile. Static-first, no client JS required.
3. **Accessible** — WCAG 2.1 AA compliant. Screen-reader tested. High contrast.
4. **Mobile-first** — Most voters will access from phones. Mobile layout is primary.
5. **Scannable** — Voters want quick answers. Bold headers, short paragraphs, compare tables.

## User Journeys

1. **Quick voter** — Opens guide, finds their race, reads summary, closes tab. Target: < 60 seconds.
2. **Deep researcher** — Reads full candidate profiles and ballot question analyses. Spends 10+ minutes.
3. **Shared link** — Someone texts a link to a specific race or question. Deep links must work.

## Quality Attributes

| Attribute | Target |
|-----------|--------|
| Performance | LCP < 2s on 3G |
| Availability | 99.9% uptime during election week |
| Accessibility | WCAG 2.1 AA |
| SEO | Structured data for election information |

## Spokes

- `docs/user-experience/journeys.md` — Detailed journey maps
- `docs/user-experience/accessibility.md` — A11y checklist and testing plan
- `docs/user-experience/design-system.md` — Typography, colors, components