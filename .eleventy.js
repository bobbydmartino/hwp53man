// .eleventy.js

module.exports = function(eleventyConfig) {
  // Pass through the entire css and js directories to the output folder.
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addGlobalData("env", process.env);
  eleventyConfig.addPassthroughCopy("CNAME");


  const pathPrefix = "/";

  return {
    dir: {
      input: ".",      
      output: "_site"
    },
    // The pathPrefix is used by the `url` filter in your templates.
    pathPrefix: pathPrefix
  };
};