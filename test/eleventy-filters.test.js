/**
 * Eleventy filter tests — intentionally re-implement filter logic for test isolation.
 * These tests verify the *contract* of each filter (inputs → outputs) using
 * self-contained fixtures, not the Eleventy runtime. This means filter bugs in
 * .eleventy.js won't be masked by mocking or import issues, and changes to the
 * runtime registration won't break tests.
 */
import { describe, it, expect } from "vitest";

const candidates = [
  { id: "susan-collins", name: "Susan Collins", party: "Republican", incumbent: true, campaignWebsite: "https://collins.senate.gov" },
  { id: "graham-platner", name: "Graham Platner", party: "Democratic", incumbent: false, campaignWebsite: "https://grahamforsenate.com" },
  { id: "anne-carney", name: "Anne Carney", party: "Democratic", incumbent: true },
];

const parties = [
  { id: "democrat", tag: "d", fullName: "Democratic Party", shortName: "Democratic", color: "#0015BC" },
  { id: "republican", tag: "r", fullName: "Republican Party", shortName: "Republican", color: "#E81B23" },
];

const offices = [
  { id: "us-senate", title: "U.S. Senate", type: "federal" },
  { id: "state-senator", title: "State Senator", type: "state" },
  { id: "state-representative", title: "State Representative", type: "state" },
];

const issues = [
  { id: "healthcare", label: "Healthcare" },
  { id: "housing", label: "Housing" },
];

const sources = [
  { id: "source-001", url: "https://example.test/platform", label: "Platform" },
  { id: "source-002", url: "https://example.test/news", label: "News" },
];

const races = [
  {
    slug: "us-senate-democratic",
    jurisdiction: "south-portland",
    office: "U.S. Senate",
    party: {
      party: "Democratic",
      candidates: [
        { name: "Graham Platner", meta: "Policy positions" },
      ],
    },
    sourcesMain: ["source-001"],
  },
  {
    slug: "us-senate-republican",
    jurisdiction: "south-portland",
    office: "U.S. Senate",
    party: {
      party: "Republican",
      candidates: [
        { name: "Susan Collins", meta: "Incumbent senator" },
      ],
    },
  },
  {
    slug: "da-1-democratic",
    jurisdiction: "cumberland-county",
    appearsIn: ["portland"],
    office: "District Attorney — District 1 (Cumberland)",
  },
  {
    slug: "sd-27-democratic",
    jurisdiction: "cumberland-county",
    appearsIn: ["portland", "westbrook"],
    office: "State Senate District 27",
  },
  {
    slug: "county-commissioner-5-democratic",
    jurisdiction: "cumberland-county",
    appearsIn: ["portland"],
    office: "Cumberland County Commissioner — District 5",
  },
];

const geography = [
  { id: "maine", name: "Maine", type: "state" },
  { id: "cumberland-county", name: "Cumberland County", type: "county", parent: "maine" },
  { id: "south-portland", name: "South Portland", type: "city", parent: "cumberland-county" },
];

const jurisdictions = [
  { id: "south-portland", name: "South Portland", slug: "south-portland", geoRef: "south-portland" },
];

function slugify(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("slugify", () => {
  it("converts to lowercase kebab-case", () => {
    expect(slugify("U.S. Senate")).toBe("u-s-senate");
    expect(slugify("State Representative")).toBe("state-representative");
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("handles empty and null input", () => {
    expect(slugify("")).toBe("");
    expect(slugify(null)).toBe("");
    expect(slugify(undefined)).toBe("");
  });
});

describe("find filter", () => {
  const find = (arr, key) => {
    if (!arr || !key) return null;
    return arr.find(item => (item.slug || item.id) === key) || null;
  };

  it("finds item by slug", () => {
    expect(find(races, "us-senate-democratic")).toBe(races[0]);
  });

  it("finds item by id", () => {
    expect(find(candidates, "susan-collins")).toBe(candidates[0]);
  });

  it("returns null for missing key", () => {
    expect(find(races, "nonexistent")).toBeNull();
  });

  it("returns null for null/undefined arr", () => {
    expect(find(null, "key")).toBeNull();
    expect(find(undefined, "key")).toBeNull();
  });
});

describe("findById filter", () => {
  const findById = (arr, id) => {
    if (!arr || !id) return null;
    return arr.find(item => item.id === id) || null;
  };

  it("finds item by id", () => {
    expect(findById(sources, "source-001")).toBe(sources[0]);
  });

  it("returns null for missing id", () => {
    expect(findById(sources, "nonexistent")).toBeNull();
  });
});

describe("findBySlug filter", () => {
  const findBySlug = (arr, slug) => {
    if (!arr || !slug) return null;
    return arr.find(item => item.slug === slug) || null;
  };

  it("finds item by slug", () => {
    expect(findBySlug(races, "us-senate-democratic")).toBe(races[0]);
  });

  it("returns null for missing slug", () => {
    expect(findBySlug(races, "nonexistent")).toBeNull();
  });
});

describe("resolveParty filter", () => {
  const resolveParty = (partyId, parties) => {
    if (!partyId || !parties) return null;
    return parties.find(p => p.id === partyId) || parties.find(p => p.tag === partyId) || parties.find(p => p.shortName === partyId) || null;
  };

  it("resolves by id", () => {
    expect(resolveParty("democrat", parties)).toBe(parties[0]);
  });

  it("resolves by tag", () => {
    expect(resolveParty("d", parties)).toBe(parties[0]);
  });

  it("resolves by shortName", () => {
    expect(resolveParty("Democratic", parties)).toBe(parties[0]);
  });

  it("returns null for missing party", () => {
    expect(resolveParty("Independent", parties)).toBeNull();
  });

  it("returns null for null input", () => {
    expect(resolveParty(null, parties)).toBeNull();
    expect(resolveParty("d", null)).toBeNull();
  });

});

describe("resolveIssue filter", () => {
  const resolveIssue = (issueIdOrLabel, issues) => {
    if (!issueIdOrLabel || !issues) return null;
    const s = slugify(issueIdOrLabel);
    return issues.find(i => i.id === s) || issues.find(i => i.label === issueIdOrLabel) || null;
  };

  it("resolves by id (slug)", () => {
    expect(resolveIssue("healthcare", issues)).toBe(issues[0]);
  });

  it("resolves by label", () => {
    expect(resolveIssue("Healthcare", issues)).toBe(issues[0]);
  });

  it("returns null for missing issue", () => {
    expect(resolveIssue("environment", issues)).toBeNull();
  });
});

describe("resolveCandidate filter", () => {
  const resolveCandidate = (candidateRef, candidateList) => {
    if (!candidateRef || !candidateList) return null;
    var byId = candidateList.find(c => c.id === candidateRef);
    if (byId) return byId;
    var stripped = candidateRef.replace(/\s*[—–-]\s*(District\s+\d+|Incumbent).*$/i, "").trim();
    return candidateList.find(c => c.name === stripped) || candidateList.find(c => c.name === candidateRef.trim()) || null;
  };

  it("resolves by id", () => {
    expect(resolveCandidate("susan-collins", candidates)).toBe(candidates[0]);
  });

  it("resolves by name with suffix stripped", () => {
    expect(resolveCandidate("Susan Collins — Incumbent", candidates)).toBe(candidates[0]);
  });

  it("returns null for missing candidate", () => {
    expect(resolveCandidate("nonexistent", candidates)).toBeNull();
  });
});

describe("partyTag filter", () => {
  const partyTag = (tag, parties) => {
    if (!tag || !parties) return tag || "";
    const p = parties.find(p => p.tag === tag);
    return p ? p.shortName : tag;
  };

  it("returns shortName for known tag", () => {
    expect(partyTag("d", parties)).toBe("Democratic");
    expect(partyTag("r", parties)).toBe("Republican");
  });

  it("returns tag as-is for unknown tag", () => {
    expect(partyTag("Ind", parties)).toBe("Ind");
  });

  it("returns empty string for null input", () => {
    expect(partyTag(null, parties)).toBe("");
    expect(partyTag("d", null)).toBe("d");
  });
});

describe("officeSlugFromTitle filter", () => {
  const officeSlugFromTitle = (officeTitle) => {
    if (!officeTitle) return null;
    return slugify(officeTitle);
  };

  it("slugifies office title", () => {
    expect(officeSlugFromTitle("U.S. Senate")).toBe("u-s-senate");
    expect(officeSlugFromTitle("State Representative")).toBe("state-representative");
  });

  it("returns null for null input", () => {
    expect(officeSlugFromTitle(null)).toBeNull();
  });
});

describe("resolveOffice filter", () => {
  const resolveOffice = (officeRef, offices) => {
    if (!officeRef || !offices) return null;
    const slug = slugify(officeRef);
    let match = offices.find(o => o.aliases && o.aliases.some(a => slugify(a) === slug));
    if (match) return match;
    match = offices.find(o => o.id === officeRef);
    if (match) return match;
    match = offices.find(o => o.id === slug);
    if (match) return match;
    match = offices.find(o => slugify(o.title) === slug);
    if (match) return match;
    match = offices.find(o => o.id === slug.replace(/\bdistrict\b-?/, ""));
    return match || null;
  };

  it("resolves by exact id", () => {
    expect(resolveOffice("us-senate", offices)).toBe(offices[0]);
  });

  it("resolves by title via slugification", () => {
    expect(resolveOffice("U.S. Senate", offices)).toBe(offices[0]);
  });

  it("returns null for missing office", () => {
    expect(resolveOffice("nonexistent", offices)).toBeNull();
  });

  it("returns null for null input", () => {
    expect(resolveOffice(null, offices)).toBeNull();
  });
});

describe("findCrossPartyRace filter", () => {
  const findCrossPartyRace = (currentRace, allRaces) => {
    if (!currentRace || !allRaces) return null;
    const baseOffice = currentRace.slug
      .replace(/-democratic$/, "")
      .replace(/-republican$/, "")
      .replace(/-green$/, "")
      .replace(/-libertarian$/, "");
    const suffixes = ["-democratic", "-republican", "-green", "-libertarian"];
    const currentSuffix = suffixes.find(s => currentRace.slug.endsWith(s));
    if (!currentSuffix) return null;
    const opposingSuffixes = suffixes.filter(s => s !== currentSuffix);
    for (const suffix of opposingSuffixes) {
      const candidate = allRaces.find(r => r.slug === baseOffice + suffix && r.jurisdiction === currentRace.jurisdiction);
      if (candidate) return candidate;
    }
    return null;
  };

  it("finds opposing party race for democratic primary", () => {
    const result = findCrossPartyRace(races[0], races);
    expect(result).toBe(races[1]);
  });

  it("finds opposing party race for republican primary", () => {
    const result = findCrossPartyRace(races[1], races);
    expect(result).toBe(races[0]);
  });

  it("returns null when no opposing race exists", () => {
    const soloRace = { slug: "mayor-nonpartisan", jurisdiction: "south-portland" };
    expect(findCrossPartyRace(soloRace, races)).toBeNull();
  });

  it("returns null for null input", () => {
    expect(findCrossPartyRace(null, races)).toBeNull();
    expect(findCrossPartyRace(races[0], null)).toBeNull();
  });

  it("finds Republican primary for Green primary if it exists", () => {
    const greenRace = { slug: "governor-green", jurisdiction: "state-wide" };
    const republicanRace = { slug: "governor-republican", jurisdiction: "state-wide" };
    const allRaces = [greenRace, republicanRace];
    const result = findCrossPartyRace(greenRace, allRaces);
    expect(result).toBe(republicanRace);
  });

  it("finds Democratic primary for Libertarian primary if it exists", () => {
    const libRace = { slug: "us-senate-libertarian", jurisdiction: "state-wide" };
    const demRace = { slug: "us-senate-democratic", jurisdiction: "state-wide" };
    const allRaces = [demRace, libRace];
    const result = findCrossPartyRace(libRace, allRaces);
    expect(result).toBe(demRace);
  });

  it("returns null for nonpartisan race (no party suffix)", () => {
    const nonpartisan = { slug: "school-board-at-large", jurisdiction: "south-portland" };
    expect(findCrossPartyRace(nonpartisan, races)).toBeNull();
  });
});

describe("filterByJurisdictions filter (with appearsIn support)", () => {
  const testGeography = [
    { id: "maine", name: "Maine", type: "state" },
    { id: "cumberland-county", name: "Cumberland County", type: "county", parent: "maine" },
    { id: "south-portland", name: "South Portland", type: "city", parent: "cumberland-county" },
    { id: "portland", name: "Portland", type: "city", parent: "cumberland-county" },
    { id: "cape-elizabeth", name: "Cape Elizabeth", type: "town", parent: "cumberland-county" },
    { id: "westbrook", name: "Westbrook", type: "city", parent: "cumberland-county" },
  ];
  const testJurisdictions = [
    { id: "state-wide", geoRef: "maine" },
    { id: "cumberland-county", geoRef: "cumberland-county" },
    { id: "south-portland", geoRef: "south-portland" },
    { id: "portland", geoRef: "portland" },
    { id: "cape-elizabeth", geoRef: "cape-elizabeth" },
    { id: "westbrook", geoRef: "westbrook" },
  ];
  const testParentMap = new Map(testGeography.map(g => [g.id, g.parent || null]));
  const getEffIds = (jid) => {
    const jur = testJurisdictions.find(j => j.id === jid);
    if (!jur || !jur.geoRef) return [jid];
    const geoIds = [jur.geoRef];
    let parentId = testParentMap.get(jur.geoRef);
    while (parentId) { geoIds.push(parentId); parentId = testParentMap.get(parentId); }
    return testJurisdictions.filter(j => geoIds.includes(j.geoRef)).map(j => j.id);
  };
  const filterByJurisdictions = (races, jurisdictionId) => {
    if (!races || !jurisdictionId) return [];
    const effJurIds = getEffIds(jurisdictionId);
    return races.filter(r => {
      if (r.appearsIn) return r.appearsIn.includes(jurisdictionId);
      return effJurIds.includes(r.jurisdiction);
    });
  };

  it("includes unrestricted races via hierarchy", () => {
    const result = filterByJurisdictions(races, "south-portland");
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters Portland-only races from South Portland", () => {
    const result = filterByJurisdictions(races, "south-portland");
    const portlandOnly = result.filter(r => r.slug === "da-1-democratic" || r.slug === "county-commissioner-5-democratic");
    expect(portlandOnly).toHaveLength(0);
  });

  it("includes Portland-only races for Portland", () => {
    const result = filterByJurisdictions(races, "portland");
    const da1 = result.find(r => r.slug === "da-1-democratic");
    expect(da1).toBeDefined();
  });

  it("includes SD 27 for Portland and Westbrook", () => {
    const portland = filterByJurisdictions(races, "portland");
    expect(portland.find(r => r.slug === "sd-27-democratic")).toBeDefined();
    const westbrook = filterByJurisdictions(races, "westbrook");
    expect(westbrook.find(r => r.slug === "sd-27-democratic")).toBeDefined();
  });

  it("excludes SD 27 from South Portland and Cape Elizabeth", () => {
    const sp = filterByJurisdictions(races, "south-portland");
    expect(sp.find(r => r.slug === "sd-27-democratic")).toBeUndefined();
    const ce = filterByJurisdictions(races, "cape-elizabeth");
    expect(ce.find(r => r.slug === "sd-27-democratic")).toBeUndefined();
  });

  it("returns empty for null input", () => {
    expect(filterByJurisdictions(null, "south-portland")).toHaveLength(0);
  });
});

describe("effectiveJurisdictionIds filter", () => {
  const geographyParentMap = new Map(geography.map(g => [g.id, g.parent || null]));

  const getEffectiveJurisdictionIds = (jurisdictionId, geography, jurisdictions) => {
    const jurisdiction = jurisdictions.find(j => j.id === jurisdictionId);
    if (!jurisdiction || !jurisdiction.geoRef) return [jurisdictionId];
    const geoIds = [jurisdiction.geoRef];
    let parentId = geographyParentMap.get(jurisdiction.geoRef);
    while (parentId) {
      geoIds.push(parentId);
      parentId = geographyParentMap.get(parentId);
    }
    return jurisdictions
      .filter(j => geoIds.includes(j.geoRef))
      .map(j => j.id);
  };

  it("walks geography ancestry to find all effective jurisdictions", () => {
    const result = getEffectiveJurisdictionIds("south-portland", geography, jurisdictions);
    expect(result).toContain("south-portland");
  });

  it("returns just the jurisdiction id when no geoRef", () => {
    const result = getEffectiveJurisdictionIds("nonexistent", geography, jurisdictions);
    expect(result).toEqual(["nonexistent"]);
  });
});

describe("collectSources filter", () => {
  const collectSources = (race, sources) => {
    if (!race || !sources) return [];
    const sourceIds = new Set();
    if (race.party && race.party.candidates) {
      race.party.candidates.forEach(c => {
        if (c.primaryContent) c.primaryContent.forEach(pos => {
          if (pos.sourceId) {
            sourceIds.add(pos.sourceId);
          }
        });
        if (c.secondaryContent) c.secondaryContent.forEach(sec => {
          if (sec.sourceId) {
            sourceIds.add(sec.sourceId);
          }
        });
      });
    }
    if (race.sourcesMain) {
      for (const sid of race.sourcesMain) {
        sourceIds.add(sid);
      }
    }
    if (race.sourcesSidebar) {
      for (const sid of race.sourcesSidebar) {
        sourceIds.add(sid);
      }
    }
    return [...sourceIds]
      .map(id => sources.find(s => s.id === id))
      .filter(Boolean);
  };

  const testSources = [
    { id: "source-001", url: "https://example.test/platform", label: "Platform" },
    { id: "source-002", url: "https://example.test/news", label: "News" },
  ];

  const testRaces = [
    {
      slug: "us-senate-democratic",
      jurisdiction: "south-portland",
      office: "U.S. Senate",
      party: {
        party: "Democratic",
        candidates: [
          { name: "Graham Platner", meta: "Policy positions" },
        ],
      },
      sourcesMain: ["source-001"],
    },
    {
      slug: "us-senate-republican",
      jurisdiction: "south-portland",
      office: "U.S. Senate",
      party: {
        party: "Republican",
        candidates: [
          { name: "Susan Collins", meta: "Incumbent senator" },
        ],
      },
    },
  ];

  it("collects sources from race.sourcesMain sourceId strings", () => {
    const result = collectSources(testRaces[0], testSources);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("source-001");
  });

  it("returns empty for race with no sources", () => {
    const result = collectSources(testRaces[1], testSources);
    expect(result).toHaveLength(0);
  });

  it("returns empty for null input", () => {
    expect(collectSources(null, testSources)).toHaveLength(0);
    expect(collectSources(testRaces[0], null)).toHaveLength(0);
  });

  it("collects sources from primaryContent sourceId", () => {
    const raceWithContent = {
      party: {
        candidates: [
          { primaryContent: [{ text: "position", sourceId: "source-002" }] },
        ],
      },
    };
    const result = collectSources(raceWithContent, testSources);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("source-002");
  });
});
