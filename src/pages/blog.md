---
layout: blog
title: Latest posts
description: Time paginated blog layout
permalink: blog/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html
excerpts: true
dates: true
pagination:
  data: collections.posts
  size: 3
  alias: posts
---

To create a paginated list of your blog posts use the `blog.njk` layout. You can set the number of posts shown per page by editing the `pagination: size: 3` front matter setting. Open `/pages/blog.md` to view the front matter setup of this page.
