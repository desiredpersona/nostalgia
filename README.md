# Nostalgia

A minimal Eleventy starter created from first principles thinking.

## Layouts

- archive.njk - Unpaginated blog layout
- blog.njk - Paginated blog layout

  Options:

  - `excerpts: true` Show excerpts in postList.
  - `dates: true` Show dates in postList.

- post.njk - Blog post layout
- page.njk - Page layout

## Features

- Stylesheet < 2KB
- Author support
  - Set default author globally in `_data/site.js`.
  - Overwrite default author in any post or page by setting `author:` in front matter.
- Post estimated reading time.
- Post ordinal dates.
- `lastModified:` Update post date. This will also update `sitemap.xml` and `feed.xml` dates.
- `canonical:` Link to a guest post on another site by setting an external url in front matter.
- Open Graph
- Twitter Cards
- Tags archive
  - `DuplicatePermalinkOutputError` Error thrown when you have duplicate tags. For example "Eleventy Themes" and "eleventy themes" tags would both create `/eleventy-themes/` urls.
- Atom feed
- Sitemap
  - `excludeFromSitemap: true` Exclude external pages from your sitemap.
- 404 page
- `metaRobots:` Overwrite meta robots tag in front matter.
  - `ELEVENTY_ENV=development` is set to `noindex, nofollow`.
  - `ELEVENTY_ENV=production` is set to `index, follow`.

## Licence

[MIT](LICENCE)
