/**
 * Eleventy configuration for Maine Voter Guide 2026-06.
 *
 * Trust boundary: templates use Nunjucks `| safe` filter to render HTML
 * from hand-curated data files (candidate.meta, position text, race context,
 * source labels). This is acceptable because all data is committed to the
 * repository by trusted editors. A build-time lint
 * (test/data-integrity.test.js → "no disallowed HTML tags") validates that
 * data strings do not contain <script>, <iframe>, <object>, <embed>, or
 * <form>. Do NOT use `| safe` on user-supplied runtime input.
 */
const fs = require('fs');
const path = require('path');

const geographyData = require('./_data/geography.js');
const geographyParentMap = new Map(geographyData.map(g => [g.id, g.parent || null]));

/**
 * Resolve jurisdiction IDs for a given jurisdiction, following geography
 * parent references to include all ancestor jurisdictions.
 * Note: Returns [jurisdictionId] silently if jurisdiction is missing or has
 * no geoRef — this masks data errors (missing jurisdiction or geography linkage).
 */
function getEffectiveJurisdictionIds(jurisdictionId, geography, jurisdictions) {
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
}

/**
 * Convert a string to a URL-safe slug: lowercase, replace non-alphanumeric
 * runs with hyphens, strip leading/trailing hyphens.
 */
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/*.png": "./" });
  eleventyConfig.addPassthroughCopy({ "public/*.ico": "./" });

  eleventyConfig.on('eleventy.after', () => {
    fs.writeFileSync('./_site/.nojekyll', '');
  });

  /**
   * Find an item by slug (preferred) or id (fallback). Uses slug-first
   * resolution because most data files key on id but templates reference slugs.
   */
  eleventyConfig.addFilter("find", function(arr, key) {
    if (!arr || !key) return null;
    return arr.find(item => (item.slug || item.id) === key) || null;
  });

  eleventyConfig.addFilter("findBallotQuestion", function(arr, slug) {
    if (!arr || !slug) return null;
    return arr.find(b => b.slug === slug) || null;
  });

  eleventyConfig.addFilter("findById", function(arr, id) {
    if (!arr || !id) return null;
    return arr.find(item => item.id === id) || null;
  });

  eleventyConfig.addFilter("findBySlug", function(arr, slug) {
    if (!arr || !slug) return null;
    return arr.find(item => item.slug === slug) || null;
  });

  eleventyConfig.addFilter("effectiveJurisdictionIds", function(jurisdictionId, geography, jurisdictions) {
    return getEffectiveJurisdictionIds(jurisdictionId, geography, jurisdictions);
  });

  eleventyConfig.addFilter("filterByJurisdictions", function(races, jurisdictionIds) {
    if (!races || !jurisdictionIds) return [];
    return races.filter(r => jurisdictionIds.includes(r.jurisdiction));
  });

  eleventyConfig.addFilter("filterBallotQuestionsByJurisdictions", function(questions, jurisdictionIds) {
    if (!questions || !jurisdictionIds) return [];
    return questions.filter(q => jurisdictionIds.includes(q.jurisdiction));
  });

  eleventyConfig.addFilter("officeSlugFromTitle", function(officeTitle) {
    if (!officeTitle) return null;
    return slugify(officeTitle);
  });

  /**
   * Resolve an office reference through 5 fallback strategies:
   * 1. Alias match (slugified alias === slugified officeRef)
   * 2. Exact id match (officeRef === office.id)
   * 3. Slug id match (slugified officeRef === office.id)
   * 4. Title match (slugified title === slugified officeRef)
   * 5. District-stripped match (remove "district" from slug and retry id)
   */
  function resolveOfficeRaw(officeRef, offices) {
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
    match = offices.find(o => o.id === slug.replace(/\bdistrict\b-?/, '')); // strip "district" for state-level office IDs like "state-representative" vs "state-representative-district-120"
    return match || null;
  }

  function resolveOfficeBase(extendsId, offices) {
    return offices.find(o => o.id === extendsId) || null;
  }

  /**
   * Resolve an office, merging with its base if it extends another office.
   * Merge rules: base properties are spread first, then raw overrides.
   * districtNote is appended to the base officeDesc if both exist.
   */
  eleventyConfig.addFilter("resolveOffice", function(officeRef, offices) {
    const raw = resolveOfficeRaw(officeRef, offices);
    if (!raw) return null;
    if (!raw.extends) return raw;
    const base = resolveOfficeBase(raw.extends, offices);
    if (!base) return raw;
    const merged = { ...base, ...raw };
    delete merged.extends;
    if (raw.districtNote && base.officeDesc) {
      merged.officeDesc = base.officeDesc + " " + raw.districtNote;
    }
    delete merged.districtNote;
    return merged;
  });

  eleventyConfig.addFilter("resolveParty", function(partyId, parties) {
    if (!partyId || !parties) return null;
    return parties.find(p => p.id === partyId) || parties.find(p => p.tag === partyId) || parties.find(p => p.shortName === partyId) || null;
  });

  /**
   * Resolve an issue by id (slugified match, preferred) or label (exact match, fallback).
   */
  eleventyConfig.addFilter("resolveIssue", function(issueIdOrLabel, issues) {
    if (!issueIdOrLabel || !issues) return null;
    const s = slugify(issueIdOrLabel);
    return issues.find(i => i.id === s) || issues.find(i => i.label === issueIdOrLabel) || null;
  });

  eleventyConfig.addFilter("resolveSource", function(sourceId, sources) {
    if (!sourceId || !sources) return null;
    return sources.find(sr => sr.id === sourceId) || null;
  });

  /**
   * Resolve a candidate reference through 3 strategies:
   * 1. Exact id match (candidateRef === candidate.id)
   * 2. Name match after stripping suffixes like " — District 120" or " — Incumbent"
   * 3. Exact name match on the raw reference
   */
  eleventyConfig.addFilter("resolveCandidate", function(candidateRef, candidates) {
    if (!candidateRef || !candidates) return null;
    var byId = candidates.find(c => c.id === candidateRef);
    if (byId) return byId;
    var stripped = candidateRef.replace(/\s*[—–-]\s*(District\s+\d+|Incumbent).*$/i, "").trim();
    return candidates.find(c => c.name === stripped) || candidates.find(c => c.name === candidateRef.trim()) || null;
  });

  /**
   * Resolve a party tag to its shortName. Returns empty string if tag is null/undefined.
   */
  eleventyConfig.addFilter("partyTag", function(tag, parties) {
    if (!tag || !parties) return tag || "";
    const p = parties.find(p => p.tag === tag);
    return p ? p.shortName : tag;
  });

  eleventyConfig.addFilter("issueSlugFromLabel", function(issueLabel) {
    if (!issueLabel) return null;
    return slugify(issueLabel);
  });

  /**
   * Collect all unique sources for a race by traversing 4 paths:
   * 1. candidate primaryContent sourceIds
   * 2. candidate secondaryContent sourceIds
   * 3. race.sourcesMain (string sourceIds)
   * 4. race.sourcesSidebar (string sourceIds)
   * Returns resolved source objects (deduplicated).
   */
  eleventyConfig.addFilter("collectSources", function(race, sources) {
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
      race.sourcesMain.forEach(s => {
        if (typeof s === "string") {
          sourceIds.add(s);
        }
      });
    }
    if (race.sourcesSidebar) {
      race.sourcesSidebar.forEach(s => {
        if (typeof s === "string") {
          sourceIds.add(s);
        }
      });
    }
    return [...sourceIds]
      .map(id => sources.find(s => s.id === id))
      .filter(Boolean);
  });

  /**
   * Find the cross-party race for a given primary. Handles D/R/G/L suffixes.
   * Returns the first opposing primary found (preferring Republican for Democratic
   * and vice versa), or null if no cross-party race exists.
   */
  eleventyConfig.addFilter("findCrossPartyRace", function(currentRace, races) {
    if (!currentRace || !races) return null;
    const partySuffixes = ['-democratic', '-republican', '-green', '-libertarian'];
    const baseOffice = partySuffixes.reduce((slug, suffix) => slug.replace(new RegExp(suffix + '$'), ''), currentRace.slug);
    const currentSuffix = partySuffixes.find(s => currentRace.slug.endsWith(s));
    if (!currentSuffix) return null;
    const opposingSuffixes = partySuffixes.filter(s => s !== currentSuffix);
    for (const suffix of opposingSuffixes) {
      const candidate = races.find(r => r.slug === baseOffice + suffix && r.jurisdiction === currentRace.jurisdiction);
      if (candidate) return candidate;
    }
    return null;
  });

  const prefix = process.env.PATH_PREFIX || "/";
  if (prefix !== "/") {
    eleventyConfig.addTransform("prefixUrls", function(content, outputPath) {
      if (!outputPath || !outputPath.endsWith('.html')) return content;
      return content.replace(/href="\//g, `href="${prefix}`)
                    .replace(/src="\//g, `src="${prefix}`);
    });
  }

  return {
    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
      layouts: "../_layouts",
    },
    pathPrefix: "/",
  };
};