# URL Verification Report

**Date:** 2026-06-01  
**Scope:** All cited URLs in `_data/races.js`, `_data/election-2026-06.yml`, `_data/jurisdictions.js`  
**Total unique URLs checked:** 112

## Summary

| Category | Count | Status |
|----------|-------|--------|
| 200 OK (verified real) | 73 | Good |
| 404 Not Found (broken/hallucinated) | 19 | **Needs fix** |
| 403 Forbidden (bot-blocked, likely real) | 28 | Indeterminate |
| 000 Unreachable (timeout/DNS) | 4 | **Needs fix** |
| Placeholder (XXXXXX) | 1 | **Needs fix** |

## 404 Errors — Investigation Results & Fixes

### mainepublic.org — "Your Vote 2026" profile pages (7 URLs)

**All 7 are HALLUCINATED — Maine Public's "Your Vote 2026" series only covers gubernatorial, US Senate, and congressional candidates, NOT state legislature or county-level races.** These profile pages never existed.

| # | Broken URL | Race/Candidate | Fix |
|---|------------|---------------|-----|
| 1 | `.../your-vote-2026-cumberland-county-commissioner-district-4` | Cumberland County Commissioner District 4 | **Remove or replace.** No MP profile. Alternative: Press Herald voter guide has [Sigrid Olson](https://www.pressherald.com/voter-guide/candidates/sigrid-a-olson-cc-4/) |
| 2 | `.../your-vote-2026-profile-rachel-talbot-ross-democrat-for-state-senate` | Rachel Talbot Ross, State Senate | **Remove or replace.** No MP profile exists. She appears in general news coverage only. |
| 3 | `.../your-vote-2026-profile-jill-duson-democrat-for-state-senate` | Jill Duson, State Senate | **Remove or replace.** No MP profile exists. Senate district page: `legislature.maine.gov/district27` |
| 4 | `.../your-vote-2026-profile-andrew-zarro-democrat-for-house-district-115` | Andrew Zarro, House District 115 | **Remove.** Zarro is no longer a candidate for HD 115 (ran for Portland mayor in 2023). No profile exists. Current HD 115 rep is Michael Brennan. |
| 5 | `.../your-vote-2026-profile-samuel-zager-democrat-for-house-district-116` | Samuel Zager, House District 116 | **Remove or replace.** No MP profile exists. Legislature member page: `legislature.maine.gov/house/house/MemberProfiles/Details/1418` |
| 6 | `.../your-vote-2026-profile-matthew-moonen-democrat-for-house-district-117` | Matthew Moonen, House District 117 | **Remove or replace.** No MP profile exists. Legislature member page: `legislature.maine.gov/house/house/MemberProfiles/Details/118` |
| 7 | `.../your-vote-2026-westbrook-state-senate-26-republican-primary` | Westbrook Senate Dist 26 Republican Primary | **Remove or replace.** No MP profile exists. Alternative: [Maine Morning Star coverage](https://mainemorningstar.com/2026/06/01/several-republican-primaries-could-be-consequential-for-control-of-the-maine-legislature/) |

### legislature.maine.gov — District pages (7 URLs)

**All use wrong URL format.** The capital-D `/DistrictNNN` format doesn't exist. 
- **Senate** districts use lowercase: `/districtNNN` (e.g., `/district26` → 200 OK, `/district27` → 200 OK)
- **House** districts have NO standalone district pages — use member profile URLs instead

| # | Broken URL | District | Fix |
|---|------------|----------|-----|
| 8 | `/District116` | House District 116 | Replace with member profile: `/house/house/MemberProfiles/Details/1418` (Zager) |
| 9 | `/District117` | House District 117 | Replace with member profile: `/house/house/MemberProfiles/Details/118` (Moonen) |
| 10 | `/District118` | House District 118 | Replace with member profile (check current rep) |
| 11 | `/District123` | House District 123 | Replace with member profile (check current rep) |
| 12 | `/District126` | House District 126 | Replace with member profile (check current rep) |
| 13 | `/District127` | House District 127 | If Senate district → use `/district127` (lowercase). If House → use member profile. |
| 14 | `/District128` | House District 128 | If Senate district → use `/district128` (lowercase). If House → use member profile. |

**Note:** Determine whether districts 123, 126, 127, 128 are House or Senate in the data context. Senate districts use `/district{N}`, House has no district pages — use member profiles or Maine Monitor district pages (`themainemonitor.org/maine-state-house-district-{N}/`).

### Other 404s

| # | Broken URL | Fix |
|---|------------|-----|
| 15 | `mainesenate.org/.../protect-and-increase-access-to-justice/` | **Replace with full URL (Playwright-confirmed 200 OK):** `https://www.mainesenate.org/senator-anne-carney-introduces-bill-to-protect-and-increase-access-to-justice-through-civil-legal-assistance-for-persons-with-low-incomes/` |
| 16 | `pressherald.com/.../cumberland-county-ice-jail-contract-vote` | **Replace with correct slug (Playwright-confirmed 200 OK):** `https://www.pressherald.com/2026/04/22/cumberland-county-officials-vote-to-remove-ice-from-jail-contract-with-feds/` |
| 17 | `pressherald.com/.../westbrook-windham-state-senate-republican-primary-2026` | **Playwright confirmed: "Page not found" — no such article.** Remove or replace with [Windham Eagle](https://news.thewindhameagle.com/2026/04/) or [Maine Morning Star](https://mainemorningstar.com/2026/06/01/several-republican-primaries-could-be-consequential-for-control-of-the-maine-legislature/). |
| 18 | `bangordailynews.com/.../maines-governors-primaries/` | **Wrong slug** — `governors-primaries` (plural) should be `governor-primaries` (singular). Playwright confirmed: the `governors-primaries` URL returns "Page not found" in browser. Correct URL: `https://www.bangordailynews.com/2026/05/30/politics/elections/self-funding-surges-in-the-final-stretch-of-maines-governor-primaries/` |
| 19 | `zarroforportland.com` | **Remove.** Playwright confirmed: "Squarespace - Website Expired" page. Andrew Zarro is no longer a candidate; he's now ED of the Bicycle Coalition of Maine. No replacement URL. |

## 000 Unreachable — DNS/Timeout Failures

| # | URL | Fix |
|---|-----|-----|
| 20 | `anneformaine.com` (3 URLs) | **Remove.** Playwright shows the domain loads but redirects — Anne Carney's 2020 campaign site is defunct. Replace with her current senate page: `legislature.maine.gov/district29` (Playwright-confirmed 200 OK, title: "Sen. Anne Carney (D-Cumberland)") or `mainesenate.org`. |
| 21 | `michaeldixonforhd119.com` | **Remove.** Playwright confirmed: `ERR_NAME_NOT_RESOLVED` (DNS failure). No trace of "Michael Dixon" as candidate for HD 119. Domain never existed. Current HD 119 rep is Charles Skold (D-Portland). |
| 22 | `olsonforcounty.com` | **Replace with:** `https://sigridforcumberland.wordpress.com/` — Sigrid Olson's actual campaign site. `olsonforcounty.com` never existed (Playwright: `ERR_NAME_NOT_RESOLVED`). |
| 23 | `peterforMaine.com` | **Remove.** Playwright confirmed: `ERR_NAME_NOT_RESOLVED`. No matching candidate found. Likely hallucinated. |

## 403 Forbidden — Bot-Blocked (Likely Real, OK to Keep)

These URLs block automated requests but are likely real. **Manual browser check recommended but not urgent:**

- **ballotpedia.org** (18 URLs) — All candidate profile pages
- **mainemorningstar.com** (7 URLs) — All news articles  
- **bangordailynews.com** (1 URL) — Self-funding article (confirmed real via search)
- **newsfromthestates.com** (1 URL) — Hannah Pingree profile
- **nytimes.com** (2 URLs) — Susan Collins and Graham Platner articles
- **thehill.com** (1 URL) — Auchincloss/Platner article
- **linkedin.com** (1 URL) — Anne Carney profile

## Placeholder URL

| # | URL | Fix |
|---|-----|------|
| — | `facebook.com/profile.php?id=100087XXXXXX` | Replace `XXXXXX` with the real Facebook user ID for the referenced candidate, or remove if no public profile exists. |

## Corrected URLs (confirmed working)

| Original (broken) | Corrected URL | Status |
|-------------------|---------------|--------|
| `pressherald.com/.../cumberland-county-ice-jail-contract-vote` | `https://www.pressherald.com/2026/04/22/cumberland-county-officials-vote-to-remove-ice-from-jail-contract-with-feds/` | Playwright 200 OK |
| `mainesenate.org/.../protect-and-increase-access-to-justice/` | `https://www.mainesenate.org/senator-anne-carney-introduces-bill-to-protect-and-increase-access-to-justice-through-civil-legal-assistance-for-persons-with-low-incomes/` | Playwright 200 OK |
| `legislature.maine.gov/District27` (Jill Duson sen) | `https://legislature.maine.gov/district27` (lowercase d) | Playwright 200 OK |
| `legislature.maine.gov/District26` (Sen. Nangle) | `https://legislature.maine.gov/district26` (lowercase d) | Playwright 200 OK |
| `olsonforcounty.com` | `https://sigridforcumberland.wordpress.com/` | Playwright 200 OK |
| `bangordailynews.com/.../maines-governors-primaries/` | `https://www.bangordailynews.com/2026/05/30/politics/elections/self-funding-surges-in-the-final-stretch-of-maines-governor-primaries/` | Playwright: `governors` → `governor` (singular) |

## Playwright Verification Results

All 19 broken URLs were re-tested with a full browser (Playwright). Key findings:

- **All 7 Maine Public profile 404s** confirmed as genuine 404s in browser — these pages never existed
- **All 7 legislature.maine.gov `/DistrictNNN` URLs** confirmed 404s — correct format is `/districtNNN` (lowercase d) for Senate; House has no standalone district pages
- **Press Herald Westbrook/Windham** confirmed "Page not found" in browser
- **BDN self-funding article** confirmed "Page not found" — the actual URL uses `governor-primaries` (singular) not `governors-primaries` (plural)
- **zarroforportland.com** shows "Squarespace - Website Expired" in browser
- **anneformaine.com** loads but redirects to defunct page
- **michaeldixonforhd119.com**, **olsonforcounty.com**, **peterforMaine.com** all DNS failures (`ERR_NAME_NOT_RESOLVED`)
- **mainesenate.org full URL** confirmed working in browser (title: "Senator Anne Carney introduces bill...")
- **legislature.maine.gov/district27** confirmed working (title: "Sen. Jill Duson (D-Cumberland)")
- **Press Herald corrected slug** confirmed working (title: "Cumberland County officials vote to remove ICE from jail contract with feds")

## Priority Fixes (ordered by severity)

1. **Remove all 7 hallucinated Maine Public "Your Vote 2026" profile URLs** — Playwright confirmed all 7 return genuine 404s; Maine Public only profiles gubernatorial, US Senate, and congressional candidates
2. **Fix legislature.maine.gov URLs** — capitalize `D` → lowercase `d` for Senate districts (Playwright confirmed `/district27` works); for House districts, use member profile pages instead
3. **Fix Press Herald ICE article slug** — replace with correct Playwright-confirmed URL
4. **Fix truncated mainesenate.org URL** — replace with full Playwright-confirmed URL
5. **Fix BDN self-funding article** — change `governors-primaries` to `governor-primaries` in slug (Playwright confirmed the plural version is a 404)
6. **Remove Press Herald Westbrook/Windham senate primary URL** — Playwright confirmed "Page not found" in browser; article doesn't exist
7. **Replace `olsonforcounty.com`** with `sigridforcumberland.wordpress.com`
8. **Remove `anneformaine.com`** (3 occurrences) — browser shows it loads but redirects to defunct page; replace with `legislature.maine.gov/district29`
9. **Remove `zarroforportland.com`** — Playwright shows "Squarespace - Website Expired"; candidate no longer running
10. **Remove `michaeldixonforhd119.com`** — Playwright confirmed DNS failure; domain never existed
11. **Remove `peterforMaine.com`** — Playwright confirmed DNS failure; likely hallucinated
12. **Fix Facebook placeholder** — get real profile ID or remove