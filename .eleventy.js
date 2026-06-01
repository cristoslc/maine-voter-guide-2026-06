module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/*.png": "./" });
  eleventyConfig.addPassthroughCopy({ "public/*.ico": "./" });

  return {
    dir: {
      input: "content",
      output: "_site",
      data: "../_data",
      includes: "../_includes",
      layouts: "../_layouts",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
};
