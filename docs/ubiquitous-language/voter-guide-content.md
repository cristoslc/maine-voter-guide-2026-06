# Voter Guide Content — Ubiquitous Language

Domain vocabulary specific to the Voter Guide Content bounded context. This context consumes Election Data and Research Syntheses to produce editorial content for voters.

## Core Aggregate

### VoterGuide
The complete editorial package for one election. Contains all Race Summaries, Question Analyses, and Voter Resources for a specific Election.

- The VoterGuide is the output of this bounded context
- It is consumed by the Presentation context for rendering
- It cites every claim back to a Source in the Research context

## Core Entities

### RaceSummary
Nonpartisan overview of a contested Race. Provides voters with the context they need to understand what the office does, why it matters, and how candidates compare.

- Contains: overview of the office, candidate profiles, key issues, comparison table
- Must be balanced across all candidates in the Race
- Example: "The City Council sets policy for the city, approves the budget, and appoints the city manager. Three candidates are vying for two at-large seats."

### CandidateProfile
A single candidate's background and stated positions, derived from Research syntheses. Every factual claim must cite a Source.

- Contains: biography, positions by issue area (each with source), endorsements, campaign finance notes
- May include direct quotes from the candidate
- Example: "Jane Smith, a small business owner, stated in her campaign website that she supports adding more affordable housing units near transit corridors."

### QuestionAnalysis
Detailed nonpartisan explanation of a BallotQuestion. Breaks down what a yes/no vote means, what the question proposes, fiscal impact, and pro/con arguments.

- Contains: plain-language summary, full explanation, fiscal impact, attributed arguments for and against, endorsements
- The analysis is the core value — voters need to understand complex ballot language
- Example: "A 'Yes' vote approves the school bond, authorizing $15 million in borrowing for athletic facility improvements."

### Position
A candidate's stated stance on a specific issue, derived from research sources. Always attributed.

- Must include the source (URL, debate transcript, speech, etc.)
- May include a direct quote for precision
- Example: "Supports increased funding for road repair" (source: candidate website, 2026-03-15)

### Argument
An attributed pro or con argument for a BallotQuestion. The attribution identifies who makes the argument, not whether it is "true" or "correct."

- Example: "The South Portland Taxpayers Association argues the bond will increase property taxes by $X per year."
- Example: "School administrators state the facilities are aging and unsafe for student use."

### Endorsement
An organization or publication's stated position on a candidate or ballot question.

- Includes: organization name, position (support/oppose), source URL, endorsement type (newspaper, nonprofit, union, etc.)
- Listed for informational purposes only — not as a recommendation

## Value Objects

### VoterResources
Standard information about how to vote, applicable across elections. Includes registration, ID requirements, absentee voting, polling places, and key dates.

- This content changes only when voting laws change
- Updated from official sources each election cycle

### IssueSummary
A balanced overview of an issue relevant to a Race. Provides background context so voters can understand candidate positions.

- Example: "South Portland's aging school facilities have been a topic of debate for several years. The district estimates $X in deferred maintenance costs."

### SourceRef
A reference back to a research Source. Every claim in voter guide content must have a SourceRef.

## Relationships

- **VoterGuide** contains many **RaceSummaries**, **QuestionAnalyses**, and one **VoterResources**
- **RaceSummary** contains many **CandidateProfiles** and **IssueSummaries**
- **CandidateProfile** contains many **Positions** and **Endorsements**
- **QuestionAnalysis** contains many **Arguments** (pro and con) and **Endorsements**

## Writing Rules

1. **Attribute every opinion** — "Candidate X stated..." not "Candidate X believes..."
2. **Neutral framing** — "supports/opposes" not "fights for/attacks"
3. **Plain language** — Explain jargon (e.g., "general obligation bond" → "a loan the city takes out, repaid through property taxes")
4. **Balanced treatment** — Same space and depth for all candidates in a race
5. **Source everything** — Every factual assertion links back to a Source
6. **No editorializing** — No evaluative language ("strong", "weak", "controversial", "common-sense")

## References

- LWV MN — [Voter Guide Best Practices](https://www.lwvmn.org/voter-guide-best-practices) (question writing standards)
- Guides.vote — [About](https://guides.vote/about) (nonpartisan methodology)
- BallotReady — [Commitment to Nonpartisanship](https://support.ballotready.org/ballotreadys-commitment-to-nonpartisanship)
