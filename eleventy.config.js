import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import lightningCSS from "@11tyrocks/eleventy-plugin-lightningcss";
import site from "./src/_data/site.js";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import htmlMin from "html-minifier-terser";
import markdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  // https://www.11ty.dev/docs/data-deep-merge/ Defaults to true in v1
  eleventyConfig.setDataDeepMerge(true);

  /*

    Plugins
    https://www.11ty.dev/docs/plugins/

  */

  // https://github.com/11ty/eleventy-navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // https://github.com/11ty/eleventy-plugin-syntaxhighlight
  eleventyConfig.addPlugin(syntaxHighlight);

  // https://github.com/5t3ph/eleventy-plugin-lightningcss
  eleventyConfig.addPlugin(lightningCSS, {
    importPrefix: "_",
    nesting: true,
    customMedia: true,
    minify: process.env.ELEVENTY_ENV === "production",
    sourceMap: process.env.ELEVENTY_ENV !== "production",
  });

  // https://github.com/11ty/eleventy-plugin-rss
  // Feed metadata is pulled from src/_data/site.js for single source of truth
  eleventyConfig.addPlugin(feedPlugin, {
    type: site.feed.type,
    outputPath: site.feed.path,
    collection: site.feed.collection,
    metadata: {
      language: site.metaLang,
      title: site.title,
      subtitle: site.feed.subtitle,
      base: `${site.url}/`,
      author: {
        name: site.author,
        email: site.email,
      },
    },
  });

  // Disable extensionless layouts
  eleventyConfig.setLayoutResolution(false);

  /*

    Transforms
    https://www.11ty.dev/docs/transforms/

  */

  // Minify HTML in production
  eleventyConfig.addTransform("htmlMin", async function (content) {
    if (
      process.env.ELEVENTY_ENV === "production" &&
      (this.page.outputPath || "").endsWith(".html")
    ) {
      try {
        return await htmlMin.minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          useShortDoctype: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        });
      } catch {
        // If minification fails (e.g. syntax-highlighted code blocks
        // with HTML-like content), return the original content
        return content;
      }
    }
    return content;
  });

  /*

    Filters
    https://www.11ty.dev/docs/filters/

  */

  // ISO post datetime for search engines to read
  eleventyConfig.addFilter("dateTime", function (value) {
    const dateObject = new Date(value);
    return dateObject.toISOString();
  });

  // Ordinal dates for humans to read
  const appendSuffix = (n) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  eleventyConfig.addFilter("ordinalDate", function (value) {
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
  eleventyConfig.addFilter("readingTime", function (text) {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  /*

    Collections
    https://www.11ty.dev/docs/collections/

  */

  // Creates a list of blog post within `/posts/` folder in reverse chronological order
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("./src/posts/*.md");
  });

  // Tags
  eleventyConfig.addCollection("tagList", function (collection) {
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
  eleventyConfig.addLayoutAlias("archive.njk", "layouts/archive.njk");
  eleventyConfig.addLayoutAlias("base.njk", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("blog.njk", "layouts/blog.njk");
  eleventyConfig.addLayoutAlias("page.njk", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("post.njk", "layouts/post.njk");

  /*

    Passthrough
    https://www.11ty.dev/docs/copy/

  */

  // Copies all files/folders to output directory
  eleventyConfig.addPassthroughCopy("src/favicons/");

  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto", 640, 1280, 1920],
    urlPath: "/img/",
    outputDir: "_site/img/",
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

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
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "al",
        symbol: "#",
        level: [1, 2, 3, 4],
      }),
      slugify: eleventyConfig.getFilter("slugify"),
    })

    // https://www.npmjs.com/package/markdown-it-attrs
    .use(markdownItAttrs, {
      allowedAttributes: ["id", "class", "rel"],
    })

    // https://www.npmjs.com/package/markdown-it-footnote
    .use(markdownItFootnote);
  md.renderer.rules.footnote_block_open = () =>
    "<hr>\n" + '<section class="fn">\n' + "<ol>\n";

  eleventyConfig.setLibrary("md", md);

  return {
    passthroughFileCopy: true,
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
