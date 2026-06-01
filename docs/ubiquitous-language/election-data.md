# Election Data — Ubiquitous Language

Domain vocabulary specific to the Election Data bounded context.

## Core Aggregates

### Election
A specific election event with a defined date, jurisdiction, and purpose. Governs the scope of all other election data entities.

- Example: **"June 2026 Primary"** — the June 9, 2026 State Primary Election for South Portland, Maine
- Example: **"November 2026 General Election"** — the November 3, 2026 General Election
- Attributes: date, type (`primary`, `general`, `special`, `referendum`), jurisdiction

### Race
A single contested office appearing on a ballot. Each Race belongs to exactly one Election and has one or more Candidates.

- Example: **City Council - At-Large** (3-year term) — one of the races on the November 2026 ballot
- Example: **Governor** — a statewide race on the June 2026 primary ballot (partisan)
- Key distinction: A Race is always for a specific office; it is not a "position" or "issue"

### BallotQuestion
A referendum, bond issue, citizen initiative, or other proposition that voters decide yes/no on. Distinct from a Race because it asks voters to decide policy rather than choose a representative.

- Example: **School Bond Referendum Question #1** — one of two bond questions on the November 2025 South Portland ballot
- Example: **People's Veto** — a citizen-initiated referendum to reject a law passed by the Legislature
- Key distinction: Not a "survey" — this is a binding ballot measure

## Core Entities

### Candidate
A person who has qualified to appear on the ballot for a specific Race. Attributes include party affiliation (for partisan races), incumbency status, and campaign contact information.

- Example: A candidate for **City Council - District One** who filed nomination papers with the City Clerk
- Key principle: Source of truth is the official candidate list from the Maine Secretary of State or municipal clerk

### PollingLocation
A physical site where voters assigned to specific Precincts cast their ballots on election day. Also serves as an in-person absentee voting location during the early voting period.

- Example: **South Portland Community Center** — may serve multiple precincts
- Key principle: Voters are assigned based on their residential address → Precinct → PollingLocation

### Precinct
A geographic subdivision of the municipality that determines which PollingLocation a voter is assigned to and which races appear on their ballot.

- Example: **South Portland District 1** — one of five city council districts, each with its own warden and ward clerk
- Key distinction: Not "district" (which can refer to congressional, state legislative, or council districts); use **Precinct** for voter assignment

### KeyDate
An election-related deadline or milestone. Includes registration deadlines, absentee ballot request and return deadlines, early voting periods, and election day itself.

- Example: **May 19, 2026** — last day to register online or by mail for the June 2026 Primary
- Example: **June 9, 2026** — Primary Election Day (polls open 7 AM - 8 PM)

## Value Objects

### Party
A qualified political party for primary participation. In Maine (2026): Democratic, Republican, Green Independent, Libertarian.

- Key nuance: Maine has semi-open primaries — unenrolled voters may choose one party's primary ballot

### OfficeType
The category of elected office: federal, statewide, county, municipal, school board.

### TermLength
The duration of an elected term, e.g., "3 years", "5 years", "unexpired term ending December 2026".

## Relationships

- **Election** has many **Races** and **BallotQuestions**
- **Election** has many **KeyDates**
- **Race** has many **Candidates**
- **Race** is for one **OfficeType**
- **BallotQuestion** belongs to one **Election**
- **Precinct** is assigned to one **PollingLocation**
- **Precinct** determines which **Races** are on a voter's ballot

## References

- Maine Secretary of State — [Upcoming Elections](https://www.maine.gov/sos/elections-voting/upcoming-elections)
- Maine Secretary of State — [Primary Candidate List (Excel)](https://www.maine.gov/sos/sites/maine.gov.sos/files/inline-files/2026%20Primary%20Candidate%20List%20posting%20FINAL%203.16.26.xlsx)
- South Portland City Clerk — [Elections & Voter Registration](https://www.southportland.org/195/Elections-Voter-Registration)
- South Portland — [Polling Locations](https://www.southportland.gov/586/Polling-Locations)
