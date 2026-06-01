const fs = require('fs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/*.png": "./" });
  eleventyConfig.addPassthroughCopy({ "public/*.ico": "./" });

  // Create .nojekyll after build to prevent GitHub Pages from running Jekyll
  eleventyConfig.on('eleventy.after', () => {
    fs.writeFileSync('./_site/.nojekyll', '');
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
