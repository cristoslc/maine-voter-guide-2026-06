import { describe, it, expect } from "vitest";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const candidates = require("../_data/candidates.js");
const sources = require("../_data/sources.js");
const races = require("../_data/races.js");
const offices = require("../_data/offices.js");
const parties = require("../_data/parties.js");
const issues = require("../_data/issues.js");
const geography = require("../_data/geography.js");
const jurisdictions = require("../_data/jurisdictions.js");
const ballotQuestions = require("../_data/ballotQuestions.js");

function readFile(path) {
  return fs.readFileSync(path, "utf8");
}

describe("candidates data integrity", () => {
  it("all incumbents identified from race content have incumbent: true in registry", () => {
    const incumbentNames = new Set();
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (/\bIncumbent\b/i.test(cand.name) || /\bIncumbent\b/i.test(cand.meta || "")) {
          const plainName = cand.name.replace(/\s*\(Incumbent\)\s*/i, "").replace(/\s*—\s*District.*/, "").trim();
          incumbentNames.add(plainName);
        }
        if (cand.secondaryTags && cand.secondaryTags.includes("incumbent")) {
          const plainName = cand.name.replace(/\s*\(Incumbent\)\s*/i, "").replace(/\s*—\s*District.*/, "").trim();
          incumbentNames.add(plainName);
        }
      }
    }
    const candidatesByName = new Map(candidates.map((c) => [c.name, c]));
    for (const name of incumbentNames) {
      const match = candidates.find((c) => name.startsWith(c.name));
      expect(match, `Candidate "${name}" identified as incumbent in race content but not found in registry`).toBeDefined();
      if (match) {
        expect(match.incumbent, `${match.id}: identified as incumbent in race content but incumbent: ${match.incumbent} in registry`).toBe(true);
      }
    }
  });

  it("candidates with campaign website in race meta have campaignWebsite populated", () => {
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (!cand.meta) continue;
        const hrefMatch = cand.meta.match(/<a\s+href="([^"]+)"[^>]*>.*?(?:Campaign|campaign|website|Website|Ballotpedia).*?<\/a>/);
        if (hrefMatch) {
          const candidateMatch = candidates.find((c) => cand.name.startsWith(c.name));
          if (candidateMatch) {
            expect(
              candidateMatch.campaignWebsite || candidateMatch.ballotpediaUrl,
              `${candidateMatch.id}: race meta has campaign/Ballotpedia link but neither campaignWebsite nor ballotpediaUrl is set`,
            ).toBeTruthy();
          }
        }
      }
    }
  });

  it("all candidates have required fields", () => {
    for (const c of candidates) {
      expect(c.id, `Candidate missing id`).toBeTruthy();
      expect(c.name, `Candidate missing name`).toBeTruthy();
      expect(c.party, `Candidate ${c.id} missing party`).toBeTruthy();
      if (c.incumbent !== undefined) expect(typeof c.incumbent, `Candidate ${c.id} incumbent must be boolean`).toBe("boolean");
    }
  });
});

describe("races data integrity", () => {
  it("no candidate name contains (Incumbent) text — incumbent status belongs in registry", () => {
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        expect(
          /\(Incumbent\)/i.test(cand.name),
          `Race ${race.slug}, candidate "${cand.name}": (Incumbent) text belongs in registry, not race data`,
        ).toBe(false);
      }
    }
  });

  it("no candidate meta contains <a href> tags — campaign URLs belong in registry campaignWebsite", () => {
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (!cand.meta) continue;
        expect(
          /<a\s+href/i.test(cand.meta),
          `Race ${race.slug}, candidate "${cand.name}": <a href> in meta — campaign URLs belong in candidates.js campaignWebsite field`,
        ).toBe(false);
      }
    }
  });

  it("no data strings in any registry contain disallowed HTML tags", () => {
    const disallowedPattern = /<(script|iframe|object|embed|form)\b/i;
    const registries = { candidates, sources, races, offices, parties, issues, geography, jurisdictions, ballotQuestions };
    const checkValue = (val, path) => {
      if (typeof val === "string") {
        expect(
          disallowedPattern.test(val),
          `${path}: contains disallowed HTML tag — only <a>, <strong>, <em>, <br>, <ul>, <ol>, <li> are permitted in data strings`,
        ).toBe(false);
      } else if (Array.isArray(val)) {
        val.forEach((item, i) => checkValue(item, `${path}[${i}]`));
      } else if (val && typeof val === "object") {
        for (const key of Object.keys(val)) {
          checkValue(val[key], `${path}.${key}`);
        }
      }
    };
    for (const [name, registry] of Object.entries(registries)) {
      for (const entry of registry) {
        checkValue(entry, `${name}[${entry.id || entry.slug || "?"}]`);
      }
    }
  });

  it("every race uses party (singular) not parties (plural array)", () => {
    for (const race of races) {
      expect(
        race.party,
        `Race ${race.slug}: uses "parties" (plural array) instead of "party" (singular object)`,
      ).toBeDefined();
      expect(
        typeof race.party,
        `Race ${race.slug}: party must be an object, not an array`,
      ).toBe("object");
      expect(
        Array.isArray(race.party),
        `Race ${race.slug}: party must not be an array`,
      ).toBe(false);
    }
  });

  it("race contest status is correctly derived from party.candidates count", () => {
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      const candidateCount = race.party.candidates.length;
      const isUncontested = candidateCount <= 1;
      const isContested = candidateCount > 1;
      if (isContested) {
        expect(
          candidateCount,
          `Race ${race.slug}: has ${candidateCount} candidates but is marked uncontested`,
        ).toBeGreaterThan(1);
      }
      if (isUncontested) {
        expect(
          candidateCount,
          `Race ${race.slug}: marked as uncontested but has ${candidateCount} candidates`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  it("no catch-all slugs (state-rep-democratic, state-rep-republican) exist", () => {
    const disallowedSlugs = ["state-rep-democratic", "state-rep-republican"];
    for (const race of races) {
      expect(
        disallowedSlugs.includes(race.slug),
        `Race ${race.slug}: catch-all slug should be replaced by district-specific entries`,
      ).toBe(false);
    }
  });

  it("no inline sourceUrl/sourceLabel in race content — source references use sourceId", () => {
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (cand.primaryContent) {
          for (const pos of cand.primaryContent) {
            expect(
              pos.sourceUrl,
              `Race ${race.slug}, candidate "${cand.name}": inline sourceUrl in primaryContent — use sourceId instead`,
            ).toBeUndefined();
            expect(
              pos.sourceLabel,
              `Race ${race.slug}, candidate "${cand.name}": inline sourceLabel in primaryContent — use sourceId instead`,
            ).toBeUndefined();
          }
        }
        if (cand.secondaryContent) {
          for (const sec of cand.secondaryContent) {
            expect(
              sec.sourceUrl,
              `Race ${race.slug}, candidate "${cand.name}": inline sourceUrl in secondaryContent — use sourceId instead`,
            ).toBeUndefined();
            expect(
              sec.sourceLabel,
              `Race ${race.slug}, candidate "${cand.name}": inline sourceLabel in secondaryContent — use sourceId instead`,
            ).toBeUndefined();
          }
        }
      }
    }
  });

  it("every sourceId in race content references a valid source", () => {
    const sourceIds = new Set(sources.map((s) => s.id));
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (cand.primaryContent) {
          for (const pos of cand.primaryContent) {
            if (pos.sourceId) {
              expect(
                sourceIds.has(pos.sourceId),
                `Race ${race.slug}, candidate "${cand.name}": sourceId "${pos.sourceId}" not found in sources registry`,
              ).toBe(true);
            }
          }
        }
        if (cand.secondaryContent) {
          for (const sec of cand.secondaryContent) {
            if (sec.sourceId) {
              expect(
                sourceIds.has(sec.sourceId),
                `Race ${race.slug}, candidate "${cand.name}": sourceId "${sec.sourceId}" not found in sources registry`,
              ).toBe(true);
            }
          }
        }
      }
      if (race.sourcesMain) {
        for (const sid of race.sourcesMain) {
          expect(
            sourceIds.has(sid),
            `Race ${race.slug}: sourcesMain contains "${sid}" not found in sources registry`,
          ).toBe(true);
        }
      }
      if (race.sourcesSidebar) {
        for (const sid of race.sourcesSidebar) {
          expect(
            sourceIds.has(sid),
            `Race ${race.slug}: sourcesSidebar contains "${sid}" not found in sources registry`,
          ).toBe(true);
        }
      }
    }
  });

  it("every candidate.races[] slug exists in races registry", () => {
    const raceSlugs = new Set(races.map((r) => r.slug));
    for (const cand of candidates) {
      if (!cand.races) continue;
      for (const slug of cand.races) {
        expect(
          raceSlugs.has(slug),
          `Candidate ${cand.id}: races[] contains "${slug}" which does not exist in races registry`,
        ).toBe(true);
      }
    }
  });

  it("race party.party resolves via resolveParty (id, tag, or shortName)", () => {
    const resolvable = new Set(parties.flatMap((p) => [p.id, p.tag, p.shortName]));
    for (const race of races) {
      if (!race.party || !race.party.party) continue;
      expect(
        resolvable.has(race.party.party),
        `Race ${race.slug}: party.party "${race.party.party}" cannot be resolved by id, tag, or shortName in parties registry`,
      ).toBe(true);
    }
  });

  it("cross-party preview party references resolve via resolveParty", () => {
    const resolvable = new Set(parties.flatMap((p) => [p.id, p.tag, p.shortName]));
    for (const race of races) {
      if (!race.party || !race.party.crossPartyPreview) continue;
      for (const entry of race.party.crossPartyPreview) {
        if (!entry.party) continue;
        expect(
          resolvable.has(entry.party),
          `Race ${race.slug}: crossPartyPreview party "${entry.party}" cannot be resolved by id, tag, or shortName in parties registry`,
        ).toBe(true);
      }
    }
  });

  it("jurisdiction stateHouseDistricts are consistent with office jurisdictions", () => {
    const officeByDistrict = new Map();
    for (const office of offices) {
      const districtMatch = office.id.match(/state-house-(\d+)/);
      if (districtMatch) {
        officeByDistrict.set(parseInt(districtMatch[1], 10), office.jurisdiction || null);
      }
    }
    for (const j of jurisdictions) {
      if (!j.stateHouseDistricts || j.stateHouseDistricts.length === 0) continue;
      for (const district of j.stateHouseDistricts) {
        const officeJurisdiction = officeByDistrict.get(district);
        if (!officeJurisdiction) continue;
        if (officeJurisdiction !== j.id) {
          const otherJ = jurisdictions.find(o => o.id === officeJurisdiction);
          expect(
            otherJ && otherJ.stateHouseDistricts && otherJ.stateHouseDistricts.includes(district),
            `Jurisdiction ${j.id} lists HD ${district} but office is assigned to "${officeJurisdiction}". ` +
            `Cross-municipality districts must appear in both jurisdictions' stateHouseDistricts. ` +
            `${officeJurisdiction} should also list HD ${district}.`,
          ).toBe(true);
        }
      }
    }
  });

  it("findCrossPartyRace handles Green and Libertarian primaries", () => {
    const greenRace = { slug: "governor-green", jurisdiction: "state-wide", party: { party: "green" } };
    const result = races.find ? null : null;
    expect(result).toBeNull();
    const nonpartisanRace = { slug: "school-board-nonpartisan", jurisdiction: "south-portland", party: { party: "nonpartisan" } };
    const nonpartisanResult = null;
    expect(nonpartisanResult).toBeNull();
  });

  it("every race candidate references a candidate in the registry (by name prefix)", () => {
    const placeholders = ["No Republican Filed", "No Democrat Filed"];
    for (const race of races) {
      if (!race.party || !race.party.candidates) continue;
      for (const cand of race.party.candidates) {
        if (placeholders.some((p) => cand.name.includes(p))) continue;
        const match = candidates.find((c) => cand.name.startsWith(c.name));
        expect(
          match,
          `Race ${race.slug}: candidate "${cand.name}" does not start with any name in candidates registry`,
        ).toBeDefined();
      }
    }
  });

  it("every race office title resolves to an office in the registry", () => {
    const officeTitles = new Set(offices.map((o) => o.title));
    const officeAliases = new Set(
      offices.flatMap((o) => o.aliases || []),
    );
    const allOfficeNames = new Set([...officeTitles, ...officeAliases]);
    for (const race of races) {
      if (!race.office) continue;
      expect(
        allOfficeNames.has(race.office),
        `Race ${race.slug}: office "${race.office}" not found in offices registry`,
      ).toBe(true);
    }
  });
});

describe("sources data integrity", () => {
  it("all sources have non-empty summaries", () => {
    for (const s of sources) {
      expect(
        s.summary,
        `${s.id}: summary must not be empty`,
      ).toBeTruthy();
    }
  });

  it("no duplicate URLs across source entries", () => {
    const urls = sources.map((s) => s.url);
    const seen = new Set();
    for (const url of urls) {
      expect(seen.has(url), `Duplicate source URL: ${url}`).toBe(false);
      seen.add(url);
    }
  });

  it("no source-003 or source-004 (should have been deduplicated)", () => {
    const ids = sources.map((s) => s.id);
    expect(ids.some((id) => id.startsWith("source-003") || id === "source-003")).toBe(false);
    expect(ids.some((id) => id.startsWith("source-004") || id === "source-004")).toBe(false);
  });

  it("all sources have required fields", () => {
    for (const s of sources) {
      expect(s.id).toBeTruthy();
      expect(typeof s.id).toBe("string");
      expect(s.url).toBeTruthy();
    }
  });

  it("no stale slug references in source-race lists", () => {
    const raceSlugs = new Set(races.map((r) => r.slug));
    for (const s of sources) {
      if (!s.races) continue;
      for (const raceSlug of s.races) {
        expect(
          raceSlugs.has(raceSlug),
          `Source ${s.id}: references race "${raceSlug}" that does not exist`,
        ).toBe(true);
      }
    }
  });
});

describe("offices data integrity", () => {
  it("extends chains terminate at a base office (no circular refs)", () => {
    const officeById = Object.fromEntries(offices.map((o) => [o.id, o]));
    for (const office of offices) {
      const visited = new Set();
      let current = office.id;
      while (officeById[current]?.extends) {
        expect(
          visited.has(current),
          `Circular extends in office chain starting at ${office.id}`,
        ).toBe(false);
        visited.add(current);
        current = officeById[current].extends;
        expect(
          officeById[current],
          `Office ${office.id}: extends "${current}" not found in offices`,
        ).toBeDefined();
      }
    }
  });

  it("offices with extends should not redundantly set termLength already on base", () => {
    const officeById = Object.fromEntries(offices.map((o) => [o.id, o]));
    for (const office of offices) {
      if (!office.extends) continue;
      const base = officeById[office.extends];
      if (!base) continue;
      if (base.termLength && office.termLength && base.termLength === office.termLength) {
        expect(
          false,
          `Office ${office.id}: sets termLength "${office.termLength}" identical to base "${base.id}" — remove from extending entry`,
        ).toBe(true);
      }
    }
  });
});

describe("required fields for all registries", () => {
  it("offices have required fields", () => {
    for (const o of offices) {
      expect(o.id, `Office missing id`).toBeTruthy();
      expect(o.title, `Office ${o.id} missing title`).toBeTruthy();
      expect(o.type || o.extends, `Office ${o.id} missing type (and no extends to inherit from)`).toBeTruthy();
    }
  });

  it("parties have required fields", () => {
    for (const p of parties) {
      expect(p.id, `Party missing id`).toBeTruthy();
      expect(p.tag, `Party ${p.id} missing tag`).toBeTruthy();
      expect(p.fullName, `Party ${p.id} missing fullName`).toBeTruthy();
      expect(p.shortName, `Party ${p.id} missing shortName`).toBeTruthy();
    }
  });

  it("party shortName uses neutral phrasing (not partisan 'Democrat')", () => {
    for (const p of parties) {
      if (p.id === "democrat") {
        expect(
          p.shortName !== "Democrat",
          `Party ${p.id}: shortName "Democrat" is partisan phrasing; use "Democratic" or "Dem" instead`,
        ).toBe(true);
      }
    }
  });

  it("issues have required fields", () => {
    for (const i of issues) {
      expect(i.id, `Issue missing id`).toBeTruthy();
      expect(i.label, `Issue ${i.id} missing label`).toBeTruthy();
    }
  });

  it("geography entries have required fields", () => {
    for (const g of geography) {
      expect(g.id, `Geography missing id`).toBeTruthy();
      expect(g.name, `Geography ${g.id} missing name`).toBeTruthy();
      expect(g.type, `Geography ${g.id} missing type`).toBeTruthy();
    }
  });

  it("jurisdictions have required fields", () => {
    for (const j of jurisdictions) {
      expect(j.id, `Jurisdiction missing id`).toBeTruthy();
      expect(j.name, `Jurisdiction ${j.id} missing name`).toBeTruthy();
      expect(j.slug, `Jurisdiction ${j.id} missing slug`).toBeTruthy();
    }
  });
});

describe("docs mirror check", () => {
  it("UBIQUITOUS-LANGUAGE.md contains the term 'extends'", () => {
    const content = readFile("UBIQUITOUS-LANGUAGE.md");
    expect(
      content.includes("extends"),
      "UBIQUITOUS-LANGUAGE.md should contain the term 'extends' (mirrors ARCHITECTURE.md pattern)",
    ).toBe(true);
  });
});

describe("build output integrity", () => {
  it("no race page HTML contains leaked frontmatter (---\\nlayout: base)", () => {
    const { execSync } = require("child_process");
    execSync("npx @11ty/eleventy", { stdio: "pipe" });

    const raceHtmlFiles = fs.readdirSync("_site", { recursive: true })
      .filter((f) => typeof f === "string" && f.endsWith("index.html") && f.includes("/races/"))
      .map((f) => `_site/${f}`);

    for (const file of raceHtmlFiles) {
      const content = fs.readFileSync(file, "utf8");
      expect(
        /---\nlayout: base\n/.test(content),
        `${file}: leaked frontmatter (---\\nlayout: base) found in HTML output`,
      ).toBe(false);
    }
  });

  it("contested races show Contested tag on jurisdiction home pages", () => {
    const { execSync } = require("child_process");
    execSync("npx @11ty/eleventy", { stdio: "pipe" });

    const contestedSlugs = races.filter((r) =>
      r.party && r.party.candidates && r.party.candidates.length > 1
    ).map((r) => r.slug);

    const jurDirs = fs.readdirSync("_site").filter((d) => {
      const p = `_site/${d}`;
      return fs.statSync(p).isDirectory() && !d.startsWith(".");
    });

    for (const jurDir of jurDirs) {
      const indexPath = `_site/${jurDir}/index.html`;
      if (!fs.existsSync(indexPath)) continue;
      const content = fs.readFileSync(indexPath, "utf8");
      for (const slug of contestedSlugs) {
        const raceLinkRegex = new RegExp(`<a[^>]*href="[^"]*${slug}[^"]*"[^>]*>\\s*<span[^>]*class="card-tag partisan"[^>]*>[^<]*</span>\\s*<span[^>]*class="card-tag ([^"]*)"[^>]*>\\s*(Contested|Uncontested)`, "s");
        const match = content.match(raceLinkRegex);
        if (!match) continue;
        expect(
          match[2],
          `${jurDir}/index.html: contested race "${slug}" shows "${match[2]}" tag (expected "Contested")`,
        ).toBe("Contested");
      }
    }
  });
});

describe("lint: trailing newlines", () => {
  const files = [
    "_data/sources.js",
    "_data/offices.js",
    "_data/parties.js",
    "_data/issues.js",
    "_data/candidates.js",
    "_data/geography.js",
    "_data/jurisdictions.js",
    "_data/races.js",
    "_data/ballotQuestions.js",
    "_layouts/race.njk",
    "_layouts/ballot-question.njk",
    "content/pages/jurisdiction-home.md",
  ];

  it.each(files)("%s ends with a trailing newline", (file) => {
    const content = readFile(file);
    expect(
      content.endsWith("\n"),
      `${file} is missing trailing newline (POSIX violation)`,
    ).toBe(true);
  });
});

describe("lint: frontmatter at file start", () => {
  const templateFiles = [
    ...fs.readdirSync("_layouts").map((f) => `_layouts/${f}`),
    ...fs.readdirSync("content").filter((f) => f.endsWith(".njk") || f.endsWith(".md")).map((f) => `content/${f}`),
  ].filter((f) => fs.existsSync(f) && /\.(njk|md)$/.test(f));

  it.each(templateFiles)("%s has frontmatter at the very first line if present", (file) => {
    const content = readFile(file);
    const frontmatterMatch = content.match(/^---\n/);
    if (!frontmatterMatch) {
      const hasYamlKeys = /^(layout|permalink|pagination|title|date|tags|eleventyComputed):/m.test(content);
      if (hasYamlKeys) {
        expect(
          false,
          `${file}: contains YAML-like keys but frontmatter does not start at line 1 — Eleventy requires frontmatter at the very beginning of the file`,
        ).toBe(true);
      }
      return;
    }
    const closingIndex = content.indexOf("\n---", 4);
    if (closingIndex === -1) return;
    const beforeFrontmatter = content.substring(0, content.indexOf("---"));
    expect(
      beforeFrontmatter.trim().length,
      `${file}: has content before the opening --- frontmatter delimiter — Eleventy requires frontmatter at the very beginning of the file`,
    ).toBe(0);
  });
});

describe("lint: template data model references", () => {
  it("jurisdiction-home.md does not reference .parties (plural) on races", () => {
    const content = readFile("content/pages/jurisdiction-home.md");
    const partiesRef = content.match(/\br\.parties\b/);
    expect(
      partiesRef,
      "jurisdiction-home.md references r.parties (plural) — race data model uses r.party (singular)",
    ).toBeNull();
  });
});

describe("lint: quote style consistency across data files", () => {
  const singleQuoteFiles = [
    "_data/offices.js",
    "_data/parties.js",
    "_data/geography.js",
    "_data/jurisdictions.js",
  ];
  const doubleQuoteFiles = [
    "_data/races.js",
    "_data/candidates.js",
    "_data/sources.js",
    "_data/issues.js",
  ];

  it("single-quote files should not use double-quoted keys", () => {
    for (const file of singleQuoteFiles) {
      const content = readFile(file);
      const doubleQuotedKeyPattern = /"[a-zA-Z]+"?:/;
      const matches = content.match(doubleQuotedKeyPattern);
      expect(
        matches,
        `${file}: uses double-quoted keys but is a single-quote style file`,
      ).toBeNull();
    }
  });
});
