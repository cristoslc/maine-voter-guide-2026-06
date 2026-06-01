# Plan: Remove Auto Dark Mode

## Problem
Current dark mode uses `prefers-color-scheme: dark` as an automatic fallback when no manual choice is stored. The user wants **only manual toggle** — no automatic switching based on OS preference.

## Changes
1. **Remove `@media (prefers-color-scheme: dark)`** block from `style.css`
2. **Update inline theme script** in `base.html` — remove the `prefers-color-scheme` check; default to light theme on first visit unless `data-theme="dark"` was explicitly chosen
3. **Simplify theme detection** to: `localStorage.theme || (localStorage.theme = "light")`

## Affected Files
- `public/css/style.css` — delete media query block
- `_layouts/base.html` — rewrite theme detection script

## Acceptance Criteria
- [ ] First-time visitors always see light theme regardless of OS setting
- [ ] Theme toggle still works manually
- [ ] Choice persists across sessions via localStorage
