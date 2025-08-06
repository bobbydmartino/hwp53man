// .eleventy.js

module.exports = function(eleventyConfig) {
  // Pass through the entire css and js directories to the output folder.
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addGlobalData("env", process.env);
  // Define a path prefix for production builds only.
  // When you run `npm start` (eleventy --serve), the prefix will be empty.
  // When your GitHub Action runs, it should build with a production flag.
  const pathPrefix = process.env.ELEVENTY_ENV === "production" ? "/hwp53man" : "/";

  return {
    dir: {
      input: ".",      
      output: "_site"
    },
    // The pathPrefix is used by the `url` filter in your templates.
    pathPrefix: pathPrefix
  };
};