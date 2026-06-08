# Retro: Missing District Attorney District 2 Race

**Date:** 2026-06-08
**Trigger:** User discovered DA District 2 contest absent from coded data 2 days before primary.

## What Happened

The District Attorney District 2 (Cumberland) — Democratic Primary race between incumbent Jacqueline Sartoris and challenger Valerie A. Adams was never coded into `_data/races.js`, despite being confirmed on the official South Portland sample ballot and covered extensively by the Press Herald.

The research was done — both `research/portland-races-2026.md` and `research/cape-elizabeth-races-2026.md` referenced DA 1 and DA 2. But the data was never promoted from research notes to structured data.

## Root Causes

### 1. Research-to-Data Gap

Research files documented DA 2 as "countywide race, not Cape-specific" and noted Stephanie Anderson's non-party filing — but framed it as a November general election note, not a June primary race. Valerie Adams was mentioned in the Cape Elizabeth research but not flagged as a primary candidate.

The SOS Non-Party Candidate List (5/26/26) showed Stephanie Anderson filing as unenrolled for DA 2 — which is **correct** (general election), but this created confusion. The primary race (Sartoris vs. Adams) was a separate Democratic primary that the research never explicitly documented.

### 2. No Systematic Ballot-Mapping Process

No step in the data-coding workflow cross-references every race on every sample ballot against the coded races. The South Portland sample ballot PDF was available as a source URL but was never OCR'd or systematically inspected. If a script compared "races on ballot" vs "races in data", this would have been caught immediately.

### 3. Office Registry Had No DA Entry

The `_data/offices.js` file had no district attorney office definition at all. DA races weren't part of the mental model of "offices we track" — suggesting the initial office scoping was done from legislative and county commissioner lists, not from the full set of elected prosecutorial offices.

### 4. Countywide Race Visibility Problem

County-level races (DA, Sheriff, Judge of Probate) fell through the cracks because the project is organized by municipality. Each municipality page shows races inherited from county and state, but the initial data entry was municipality-first — starting from "what's on the South Portland ballot" but building the race registry from "what legislative districts intersect this town." Countywide races don't belong to any one legislative district and were missed.

## Action Items

- [ ] **Add a "ballot reconciliation" step to the data workflow:** Before marking primary coverage complete, extract the race list from every available sample ballot PDF and compare against the coded race slugs.
- [ ] **Pre-populate office registry from Maine SOS county office election cycle list** to ensure all elected offices on the ballot are defined before coding begins.
- [ ] **Add a countywide-race checklist** to the project navigation docs listing all Cumberland County races (DA 1, DA 2, Sheriff, Judge of Probate, Register of Deeds, Treasurer, County Commissioner districts) for each election cycle.
- [ ] **Document in UBIQUITOUS-LANGUAGE.md** that "DA 2" is the 2nd Prosecutorial District (Cumberland County) — not "District 2" of some other entity.