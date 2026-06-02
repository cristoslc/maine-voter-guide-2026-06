# Data Model

Canonical data model extracted from analysis of exemplar voter guides (VOTE411, Ballotpedia, Guides.vote, BallotReady, The Maine Monitor).

## Election Data Context

### Election

An election event with a specific date and purpose.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | slug | yes | Unique identifier (e.g., `2026-06-primary`) |
| `title` | string | yes | Human-readable name |
| `date` | date | yes | Election day |
| `type` | enum | yes | `primary`, `general`, `special`, `referendum` |
| `jurisdiction` | string | yes | Geographic scope |
| `races` | Race[] | yes | Races on this ballot |
| `ballot-questions` | BallotQuestion[] | | Questions on this ballot |
| `key-dates` | KeyDate[] | | Registration and absentee deadlines |

### Race

A single contested office on the ballot.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | slug | yes | Unique identifier |
| `title` | string | yes | Office title (e.g., "City Council - At-Large") |
| `jurisdiction` | string | yes | Geographic scope |
| `term-length` | string | | e.g., "3 years" |
| `term-end` | date | | If unexpired term |
| `seats-available` | integer | | Number of seats open |
| `type` | enum | | `partisan`, `nonpartisan`, `nonpartisan-primary` |
| `candidates` | Candidate[] | | Candidates in this race |
| `key-issues` | string[] | | Issues to watch (from research synthesis) |

### Candidate

A person running for office.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | slug | yes | Unique identifier |
| `name` | string | yes | Full name |
| `party` | string | | Party affiliation (if partisan race) |
| `incumbent` | boolean | | Currently holds this office |
| `occupation` | string | | Current job |
| `residence` | string | | Neighborhood or ward |
| `campaign-website` | URL | | Official campaign site |
| `social-media` | object | | Links |
| `photo` | URL | | Candidate headshot |
| `ballotpedia-url` | URL | | Link to Ballotpedia profile |
| `contact-email` | string | | Campaign email |
| `sources` | SourceRef[] | yes | Primary sources ingested in rk |

### BallotQuestion

A referendum, bond, or citizen initiative on the ballot.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | slug | yes | Unique identifier |
| `title` | string | yes | Short label |
| `question-text` | string | yes | The exact ballot language |
| `department` | string | | Issuing body |
| `type` | enum | | `bond`, `initiative`, `referendum`, `charter-amendment` |
| `fiscal-impact` | string | | Official cost estimate |
| `sources` | SourceRef[] | yes | Full text, fiscal note, legislative history |

### PollingLocation

A physical site where voters cast ballots.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | slug | yes | Unique identifier |
| `name` | string | yes | Location name (e.g., "South Portland Community Center") |
| `address` | string | yes | Street address |
| `precincts` | string[] | yes | Which precincts vote here |
| `accessible` | boolean | | Wheelchair accessible |
| `hours` | string | | Polling hours (election day) |

### Precinct

A geographic subdivision assigning voters to a polling location.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Precinct number/name |
| `polling-location` | PollingLocation.id | yes | Assigned polling place |
| `wards` | string[] | | Ward breakdown if applicable |

### KeyDate

An important election-related deadline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | yes | Calendar date |
| `description` | string | yes | What happens |
| `source` | string | yes | Authority citation |
| `type` | enum | | `registration`, `absentee-request`, `absentee-return`, `early-voting`, `election-day` |

## Voter Guide Content Context

### VoterGuide

The complete editorial package for one election. This is the output of the bounded context.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `election` | Election.id | yes | Which election this covers |
| `race-summaries` | RaceSummary[] | yes | One per race |
| `question-analyses` | QuestionAnalysis[] | | One per ballot question |
| `voter-resources` | VoterResources | yes | How-to-vote information |
| `last-updated` | date | yes | Content freshness date |

### RaceSummary

Nonpartisan overview of a contested race.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `race` | Race.id | yes | Which race |
| `overview` | string | yes | What this office does, why it matters |
| `candidates` | CandidateProfile[] | yes | One per candidate |
| `key-issues` | IssueSummary[] | | Issues voters should consider |
| `comparison-table` | table | | Side-by-side positions |
| `sources` | SourceRef[] | yes | Research sources for all claims |

### CandidateProfile

A candidate's background and stated positions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candidate` | Candidate.id | yes | Which candidate |
| `biography` | string | | Background, experience, residence |
| `positions` | Position[] | | Stated positions per issue area |
| `endorsements` | Endorsement[] | | Notable endorsements |
| `campaign-finance` | string | | Fundraising overview (if available) |
| `sources` | SourceRef[] | yes | Every claim cites a source |

### Position

A candidate's stated position on an issue.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `issue` | string | yes | Issue area |
| `summary` | string | yes | Concise position statement |
| `source` | SourceRef | yes | Where this position was stated |
| `quote` | string | | Direct quote if available |

### IssueSummary

A balanced overview of an issue in a race.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `issue` | string | yes | Issue area |
| `context` | string | yes | Background voters need to understand |
| `candidate-positions` | CandidatePosition[] | yes | Where each candidate stands |

### QuestionAnalysis

Pro/con breakdown of a ballot question.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ballot-question` | BallotQuestion.id | yes | Which question |
| `plain-language` | string | yes | What a yes/no vote means |
| `what-it-proposes` | string | yes | Detailed explanation |
| `fiscal-impact` | string | | Cost or tax effect |
| `arguments-for` | Argument[] | | Pro arguments (attributed) |
| `arguments-against` | Argument[] | | Con arguments (attributed) |
| `endorsements` | Endorsement[] | | Organizations taking a position |
| `sources` | SourceRef[] | yes | Full text, fiscal note, analysis refs |

### Argument

An attributed pro/con argument.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `statement` | string | yes | The argument |
| `attribution` | string | yes | Who makes this argument |
| `source` | SourceRef | | Link to full statement |

### Endorsement

An organization's stated position.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization` | string | yes | Name of endorsing entity |
| `position` | enum | yes | `support`, `oppose` |
| `source` | SourceRef | yes | Link to endorsement statement |
| `type` | enum | | `newspaper`, `nonprofit`, `union`, `political-party` |

### VoterResources

How-to-vote information applicable to this election.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `registration` | string | yes | How to register, check status |
| `id-requirements` | string | | What ID voters need |
| `absentee-voting` | string | | How to vote by mail |
| `early-voting` | string | | In-person early voting info |
| `polling-places` | string | | How to find your polling location |
| `key-dates` | KeyDate[] | yes | All deadlines in one place |
| `rcv-info` | string | | Ranked-choice voting explanation |

## SourceRef Pattern

Every claim in voter guide content references back to its research source.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source-id` | string | yes | ID in rk library |
| `url` | URL | | Original source URL |
| `title` | string | | Source title |
| `summary` | string | yes | 1-3 sentence description of what the source covers and its relevance |
| `accessed` | date | yes | When ingested |
| `type` | enum | | `website`, `video`, `pdf`, `news-article`, `debate-transcript`, `campaign-material` |
