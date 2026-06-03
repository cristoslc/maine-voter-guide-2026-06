const fs = require('fs');
const path = require('path');

function getEffectiveJurisdictionIds(jurisdictionId, geography, jurisdictions) {
  const jurisdiction = jurisdictions.find(j => j.id === jurisdictionId);
  if (!jurisdiction || !jurisdiction.geoRef) return [jurisdictionId];
  const geoIds = [jurisdiction.geoRef];
  let current = geography.find(g => g.id === jurisdiction.geoRef);
  while (current && current.parent) {
    geoIds.push(current.parent);
    current = geography.find(g => g.id === current.parent);
  }
  return jurisdictions
    .filter(j => geoIds.includes(j.geoRef))
    .map(j => j.id);
}

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
    match = offices.find(o => o.id === slug.replace(/\bdistrict\b-?/, ''));
    return match || null;
  }

  function resolveOfficeBase(extendsId, offices) {
    return offices.find(o => o.id === extendsId) || null;
  }

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
    return parties.find(p => p.id === partyId) || parties.find(p => p.tag === partyId) || null;
  });

  eleventyConfig.addFilter("resolveIssue", function(issueIdOrLabel, issues) {
    if (!issueIdOrLabel || !issues) return null;
    const s = slugify(issueIdOrLabel);
    return issues.find(i => i.id === s) || issues.find(i => i.label === issueIdOrLabel) || null;
  });

  eleventyConfig.addFilter("resolveSource", function(sourceId, sources) {
    if (!sourceId || !sources) return null;
    return sources.find(sr => sr.id === sourceId) || null;
  });

  eleventyConfig.addFilter("resolveCandidate", function(candidateRef, candidates) {
    if (!candidateRef || !candidates) return null;
    return candidates.find(c => c.id === candidateRef) || candidates.find(c => candidateRef.startsWith(c.name)) || null;
  });

  eleventyConfig.addFilter("partyTag", function(tag, parties) {
    if (!tag || !parties) return tag;
    const p = parties.find(p => p.tag === tag);
    return p ? p.shortName : tag;
  });

  eleventyConfig.addFilter("officeSlugFromTitle", function(officeTitle) {
    if (!officeTitle) return null;
    return slugify(officeTitle);
  });

  eleventyConfig.addFilter("issueSlugFromLabel", function(issueLabel) {
    if (!issueLabel) return null;
    return slugify(issueLabel);
  });

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

  eleventyConfig.addFilter("findCrossPartyRace", function(currentRace, races) {
    // Each race has a single party block (race.party). The cross-party race
    // for a Democratic primary is the Republican primary for the same office,
    // and vice versa.
    if (!currentRace || !races) return null;
    const baseOffice = currentRace.slug
      .replace(/-democratic$/, '')
      .replace(/-republican$/, '');
    const opposingSuffix = currentRace.slug.endsWith('-democratic') ? '-republican' : '-democratic';
    const opposingSlug = baseOffice + opposingSuffix;
    return races.find(r => r.slug === opposingSlug && r.jurisdiction === currentRace.jurisdiction) || null;
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