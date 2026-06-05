# Commission / Warrant PR Workflow

## Overview

Large features use a two-tier branch/PR structure to keep changes reviewable without blocking forward motion.

```
main
  └── feat/<commission>        (commission PR — Draft, never merged until complete)
        └── feat/<commission>/<warrant>   (warrant PR — merges into commission branch)
```

## Labels

- `commission` — Strategic parent PR. Draft status, `WIP:` title prefix. Merges to `main`.
- `warrant` — Tactical sub-PR. Merges into the commission branch via PR. Target branch is `feat/<commission>`, not `main`.

## Naming

- Commission branch: `feat/<short-description>` (e.g., `feat/visual-identity`)
- Warrant branch: `feat/<commission>/<short-description>` (e.g., `feat/visual-identity/phase-1-tokens`)
- Commission PR title: `WIP: <description>`
- Warrant PR title: `<description>` (no WIP prefix)

## Flow

1. **Commission** PR is created as Draft from `feat/<commission>` → `main`, labelled `commission`.
2. For each unit of work, create a **warrant** branch off `feat/<commission>`.
3. Open a warrant PR from `feat/<commission>/<warrant>` → `feat/<commission>`, labelled `warrant`.
4. Merge approved warrants into `feat/<commission>`.
5. When all warrants are done, mark the commission PR Ready for Review and merge to `main`.

## Git commands

```bash
# Create warrant branch
git checkout feat/visual-identity
git checkout -b feat/visual-identity/phase-1-tokens
git push -u origin feat/visual-identity/phase-1-tokens

# Create warrant PR
gh pr create --title "Phase 1: CSS Token Migration" \
  --base feat/visual-identity --head feat/visual-identity/phase-1-tokens \
  --label warrant
```