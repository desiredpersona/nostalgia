module.exports = {
  environment: process.env.ELEVENTY_ENV,
  metaLang: "en",
  metaLocale: "en_US",
  metaRobots: "index, follow",
  googleAnalytics: "",
  title: "Nostalgia",
  url: "https://example.com",
  author: "Desired Persona",
  email: "hello@example.com",
  twitterCreator: "@twitterHandle",
  twitterSite: "@twitterSiteHandle",
  feed: {
    subtitle: "minimal Eleventy starter",
    filename: "feed.xml",
    path: "/feed.xml",
    url: "https://example.com/feed.xml",
    id: "https://example.com",
  },
  post: {
    readingTime: true,
  },
  text: {
    previous: "← Previous page",
    next: "Next page →",
    readingTime: "minute read",
    updated: "Updated",
  },
};
