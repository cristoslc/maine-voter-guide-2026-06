# Post-Migration Validation

Run these integrity checks after each phase before committing.

## Phase 1: Registry Integrity

```js
// Every officeId in races matches an office in offices.js
races.every(r => offices.some(o => o.id === r.office))

// Every jurisdiction.geoRef matches a geography node
jurisdictions.every(j => geography.some(g => g.id === j.geoRef))

// Every distinct issue value extracted
const issuesInRaces = new Set(races.flatMap(r =>
  r.parties.flatMap(p =>
    p.candidates.flatMap(c =>
      c.primaryContent.map(pos => pos.issue).filter(Boolean)
    )
  )
));
const issuesInRegistry = new Set(issues.map(i => i.id));
// issuesInRaces should be a subset of issuesInRegistry

// No duplicate issue labels (case-sensitive)
new Set(issues.map(i => i.label.toLowerCase())).size === issues.length
```

## Phase 2: FK Integrity

```js
// Every race.office FK resolves
races.every(r => offices.some(o => o.id === r.office))

// Every race.jurisdiction FK resolves
races.every(r => jurisdictions.some(j => j.id === r.jurisdiction))

// Every race.party FK resolves
races.every(r => parties.some(p => p.id === r.party))

// Every candidate in race.candidates FK resolves
races.every(r => r.candidates.every(c => candidates.some(ca => ca.id === c)))

// No duplicate race slugs
new Set(races.map(r => r.id)).size === races.length

// Every issue FK in positionGroups resolves
races.every(r =>
  r.positionGroups.every(pg =>
    pg.primaryContent.every(pos =>
      issues.some(i => i.id === pos.issue)
    )
  )
)
```

## Phase 3: Candidate Integrity

```js
// Every candidate.id referenced in any race exists in candidates.js
const referencedCandidates = new Set(races.flatMap(r => r.candidates));
referencedCandidates.every(c => candidates.some(ca => ca.id === c))

// Every candidate.races array includes all races referencing them
races.forEach(r => {
  r.candidates.forEach(cId => {
    const c = candidates.find(ca => ca.id === cId);
    if (!c.races.includes(r.id)) {
      console.error(`MISSING: ${cId} missing ${r.id} in races[]`);
    }
  });
});
```

## Phase 4: Source Integrity

```js
// Every sourceId referenced in any position exists in sources.js
const referencedSources = new Set();
races.forEach(r => {
  r.positionGroups.forEach(pg => {
    pg.primaryContent.forEach(pos => {
      pos.sourceIds.forEach(sId => referencedSources.add(sId));
    });
  });
});
referencedSources.every(s => sources.some(sr => sr.id === s))

// Every source.races array includes all races referencing them
races.forEach(r => {
  r.positionGroups.forEach(pg => {
    pg.primaryContent.forEach(pos => {
      pos.sourceIds.forEach(sId => {
        const s = sources.find(sr => sr.id === sId);
        if (!s.races.includes(r.id)) {
          console.error(`MISSING: source ${sId} missing race ${r.id} in races[]`);
        }
      });
    });
  });
});

// No orphan sources (every source referenced by at least 1 race)
sources.every(s => s.races.length > 0)
// No orphan candidates (every candidate referenced by at least 1 race)
candidates.every(c => c.races.length > 0)
```

## Post-Phase 5: Page Count Integrity

```bash
# Compare total page count before and after migration
npm run build
find _site -name 'index.html' | wc -l
# Must match the pre-migration page count exactly
```

## Post-Phase 5: URL Integrity

```bash
# Every pre-migration URL still exists
find _site -name 'index.html' | sort > /tmp/urls-after.txt
# Compare against pre-migration snapshot
diff /tmp/urls-before.txt /tmp/urls-after.txt
# Expected: diff should be empty
```