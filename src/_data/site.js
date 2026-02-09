export default {
  // Environment
  environment: process.env.ELEVENTY_ENV,

  // Site metadata
  title: "Nostalgia",
  url: "https://example.com",
  author: "Desired Persona",
  email: "hello@example.com",

  // Language and locale settings
  metaLang: "en",
  metaLocale: "en_US",
  metaRobots: "index, follow",

  // Analytics
  googleAnalytics: "",

  // Social media
  twitterCreator: "@twitterHandle",
  twitterSite: "@twitterSiteHandle",

  // RSS/Atom feed configuration
  // Used by @11ty/eleventy-plugin-rss and templates
  feed: {
    // Used by templates (e.g., base.njk for <link rel="alternate">)
    path: "/feed.xml",
    subtitle: "minimal Eleventy starter",

    // Plugin-specific settings
    type: "atom", // Options: "atom", "rss", "json"
    collection: {
      name: "posts",
      limit: 0, // 0 means no limit
    },
  },

  // Post display settings
  post: {
    readingTime: true,
  },

  // UI text strings (for easy localization)
  text: {
    previous: "← Previous page",
    next: "Next page →",
    readingTime: "minute read",
    updated: "Updated",
  },
};
