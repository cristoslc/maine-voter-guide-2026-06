const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/*.png": "./" });
  eleventyConfig.addPassthroughCopy({ "public/*.ico": "./" });

  // Create .nojekyll after build to prevent GitHub Pages from running Jekyll
  eleventyConfig.on('eleventy.after', () => {
    fs.writeFileSync('./_site/.nojekyll', '');
  });

  // Find filter: look up a jurisdiction by slug
  eleventyConfig.addFilter("find", function(arr, slug) {
    if (!arr || !slug) return null;
    return arr.find(j => j.slug === slug) || null;
  });

  // findBallotQuestion filter: look up a ballot question by slug
  eleventyConfig.addFilter("findBallotQuestion", function(arr, slug) {
    if (!arr || !slug) return null;
    return arr.find(b => b.slug === slug) || null;
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
