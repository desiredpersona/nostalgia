const cleanCSS = require("clean-css");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const htmlMinifier = require("html-minifier");
const markdownIt = require("markdown-it");
const markdownItAbbr = require("markdown-it-abbr");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const pluginRss = require("@11ty/eleventy-plugin-rss");

/*

  Global data files
  https://www.11ty.dev/docs/data-global/

*/

// Import global data file
const site = require("./src/_data/site.json");

module.exports = function (config) {
  // https://www.11ty.dev/docs/data-deep-merge/
  config.setDataDeepMerge(true);

  /*

    Plugins
    https://www.11ty.dev/docs/plugins/

  */

  // https://github.com/11ty/eleventy-navigation
  config.addPlugin(eleventyNavigationPlugin);

  // https://github.com/11ty/eleventy-plugin-rss
  config.addPlugin(pluginRss);

  /*

    Filters
    https://www.11ty.dev/docs/filters/

  */

  // Minify CSS in production
  config.addFilter("cssMin", function (code) {
    if (process.env.ELEVENTY_ENV == "production") {
      return new cleanCSS({}).minify(code).styles;
    }
    return code;
  });

  // ISO post datetime for search engines to read
  config.addFilter("dateTime", function (value) {
    const dateObject = new Date(value);
    return dateObject.toISOString();
  });

  // Ordinal dates for humans to read
  const appendSuffix = (n) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  config.addFilter("ordinalDate", function (value) {
    const dateObject = new Date(value);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayWithSuffix = appendSuffix(dateObject.getDate());

    // You may change the date format below by uncommenting that line.

    // 1. Month Day, Year
    // return `${months[dateObject.getMonth()]} ${dayWithSuffix}, ${dateObject.getFullYear()}`;

    // 2. Day Month Year
    return `${dayWithSuffix} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
  });

  // Calculate blog posts reading time
  config.addFilter("readingTime", function (text) {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  /*

    Transforms
    https://www.11ty.dev/docs/config/#transforms

  */

  // https://github.com/kangax/html-minifier
  config.addTransform("htmlMin", function (value, outputPath) {
    if (
      process.env.ELEVENTY_ENV == "production" &&
      outputPath &&
      outputPath.indexOf(".html") > -1
    ) {
      let minified = htmlMinifier.minify(value, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
      });
      return minified;
    }
    return value;
  });

  /*

    Collections
    https://www.11ty.dev/docs/collections/

  */

  // Creates a list of blog post within `/posts/` folder in reverse chronological order
  config.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("./src/posts/*.md").reverse();
  });

  // Tags
  config.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  /*

    Layouts
    https://www.11ty.dev/docs/layouts/

  */

  // https://www.11ty.dev/docs/layouts/#layout-aliasing
  config.addLayoutAlias("archive", "layouts/archive.njk");
  config.addLayoutAlias("base", "layouts/base.njk");
  config.addLayoutAlias("blog", "layouts/blog.njk");
  config.addLayoutAlias("page", "layouts/page.njk");
  config.addLayoutAlias("post", "layouts/post.njk");

  /*

    Passthrough
    https://www.11ty.dev/docs/copy/

  */

  // Copies all files/folders to `/dist/` folder
  config.addPassthroughCopy("./src/assets/");
  config.addPassthroughCopy("./src/feed.xml");
  config.addPassthroughCopy("./src/sitemap.xml");
  config.addPassthroughCopy("./src/netlify.toml");
  config.addPassthroughCopy("./src/404.html");

  /*

    Markdown Library
    https://github.com/markdown-it/markdown-it

  */

  const md = markdownIt({
    // Enable HTML tags in source. Copies HTML tags to the output directory
    html: true,
    // Convert '\n' in paragraphs into <br>
    breaks: true,
    // Autoconvert URL-like text to links
    linkify: false,
  })
    // https://www.npmjs.com/package/markdown-it-abbr
    .use(markdownItAbbr)

    // https://www.npmjs.com/package/markdown-it-anchor
    .use(markdownItAnchor, {
      level: [1, 2, 3, 4, 5, 6],
      permalink: true,
      permalinkClass: "al",
      permalinkSymbol: "#",
      permalinkBefore: false,
    })

    // https://www.npmjs.com/package/markdown-it-attrs
    .use(markdownItAttrs, {
      allowedAttributes: ["id", "class", "rel"],
    })

    // https://www.npmjs.com/package/markdown-it-footnote
    .use(markdownItFootnote);
  md.renderer.rules.footnote_block_open = () =>
    "<hr>\n" + '<section class="fn">\n' + "<ol>\n";

  config.setLibrary("md", md);

  return {
    passthroughFileCopy: true,
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
  };
};
