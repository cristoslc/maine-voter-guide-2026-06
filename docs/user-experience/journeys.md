# User Journeys

Detailed journey maps for the South Portland Voter Guide.

## Journey 1: Quick Voter (Target: < 60 seconds)

**Goal**: Find their race, read the summary, understand the stakes, close the tab.

1. Lands on home page from a shared link or search
2. Scans the quick-links grid ("US Senate," "Governor," "State House")
3. Taps the race they care about
4. Reads the candidate names and 1-2 key positions per candidate
5. Makes a mental note
6. Leaves

**Critical requirements**:
- Race summaries must load in < 2s on mobile
- Candidate names must be prominent (largest text on the race page)
- Positions must be scannable (one sentence each, bolded)
- No navigation required beyond the tap from the home page
- Key dates in footer or persistent element

## Journey 2: Deep Researcher (10+ minutes)

**Goal**: Understand every race and candidate on their ballot.

1. Starts at home page
2. Reads the voter resources page (registration, polling, absentee)
3. Visits each race page sequentially
4. For Governor, reads all 12 candidates, notes positions
5. Reads school budget analysis (pro/con, fiscal impact)
6. Compares candidates side-by-side
7. Shares a race link with a friend or family member

**Critical requirements**:
- Race pages must have deep-link anchors for each candidate
- Comparison tables must work on small screens
- Every claim must have a visible source citation
- Shareable URLs for every race

## Journey 3: Shared Link

**Goal**: Arrive at a specific race or question from a text message or social media.

1. Taps a link someone sent: e.g., `/races/governor/`
2. Arrives directly at the race page
3. Scrolls vertically through candidates
4. May navigate to voter resources or home

**Critical requirements**:
- Every race, question, and resource page must have a stable URL
- Pages must render correctly when accessed via direct link (no dependency on home page state)
- Back/forward browser navigation works
- Breadcrumb or back-link to home

## Journey 4: Polling Place Finder (sub-30 seconds)

**Goal**: Find where to vote, right now.

1. Arrives at voter resources page
2. Finds the "Find Your Polling Place" link
3. Taps the external link to the SoS polling place lookup
4. Or reads the polling locations list for South Portland

**Critical requirements**:
- Polling place info must be findable in < 3 scrolls on mobile
- External link prominently displayed
- Hours clearly stated (7 AM–8 PM)

## Journey 5: Absentee Voter

**Goal**: Request an absentee ballot and understand deadlines.

1. Visits voter resources page
2. Finds absentee voting section
3. Taps the absentee request link
4. Notes the deadlines
5. May bookmark or share the page

**Critical requirements**:
- Deadlines must be dated and sourced
- Absentee request link must be prominent
- Return instructions (drop box, mail, in-person) clearly listed
