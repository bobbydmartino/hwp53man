module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const url = req.url;
          if (!url.endsWith("/") && !url.includes(".")) {
            res.writeHead(301, { Location: url + "/" });
            res.end();
          }
        });
      }
    }
  });

  process.env.ELEVENTY_ENV = "production";

  return {
    dir: {
      input: ".",      
      includes: "_includes",
      output: "_site"
    },
    pathPrefix: "/legacy-code-base"
  };
};
