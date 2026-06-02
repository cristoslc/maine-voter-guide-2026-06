# Rollback Plan

Each phase is isolated in its own commit. Rollback is a targeted `git checkout`.

## Per-Phase Rollback

| Phase | Rollback Command | Data Loss | Notes |
|-------|-----------------|-----------|-------|
| 1 | `git checkout HEAD~1 -- _data/` | Phase 1 data files | Old `jurisdictions.js` restored; new files (`geography.js`, `offices.js`, etc.) deleted by checkout |
| 2 | `git checkout HEAD~1 -- _data/ _layouts/ content/` | Phase 2 data + templates | Old `races.js` restored; old `race.njk` layout restored |
| 3 | `git checkout HEAD~1 -- _data/` | Phase 3 data | `candidates.js` deleted; old `races.js` (pre-phase-3) restored |
| 4 | `git checkout HEAD~1 -- _data/` | Phase 4 data | `sources.js` deleted; old `races.js` + `ballotQuestions.js` (inline URLs) restored |
| 5 | `git checkout HEAD~1 -- docs/ ARCHITECTURE.md UBIQUITOUS-LANGUAGE.md DEVELOPER-WORKFLOWS.md` | Scaffolding docs | Only hub/spoke files affected |
| 6 | `git checkout HEAD~1` | Polish + tests | Full revert of last polish commit |

## Full Rollback

If the entire migration needs to be unwound:

```bash
git revert HEAD~6..HEAD
```

This creates 6 revert commits in reverse order, restoring the pre-migration state.

## Testing Rollback

Before each phase, record the pre-migration page count and URL list:

```bash
npm run build
find _site -name 'index.html' | sort > /tmp/urls-before.txt
find _site -name 'index.html' | wc -l > /tmp/page-count.txt
```

After rollback, verify:

```bash
npm run build
diff /tmp/urls-before.txt <(find _site -name 'index.html' | sort) || echo "ROLLBACK FAILED - URL MISMATCH"
```

## Commit Convention for Rollback Safety

```
Phase N: <description>

This commit is part of the DDD refactor migration. Rollback with:
  git checkout HEAD~1 -- _data/ [affected directories]
```

Include the specific rollback command in every phase commit message so any agent or human can reverse a single phase without analysis.