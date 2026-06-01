# Infrastructure — Tech Stack Spoke

## Hosting

Static hosting provider to be determined. Evaluation criteria:
- Global CDN (fast load for South Portland voters)
- Custom domain support
- HTTPS by default
- Build hook or auto-deploy from git
- Free or low-cost tier sufficient (small site)

Candidates: Cloudflare Pages, Netlify, GitHub Pages.

## CI/CD

- Build: `npm run build`
- Output: `_site/`
- On push to main: build → deploy
- PR preview: deploy to preview URL

## Quality Tooling

| Tool | Command | Purpose |
|------|---------|---------|
| Eleventy dry run | `npm run lint` | Check builds succeed |
| Broken link checker | `npm run test:links` | Verify all links |
| `git-secrets` | pre-commit hook | Prevent credential leaks |

## DNS

To be determined. Custom domain (`sopovoterguide.org` or similar) to be configured before launch.

## Analytics

Privacy-respecting analytics (Plausible or Fathom). No tracking cookies. Self-hosted or privacy-focused provider only.
