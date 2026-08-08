---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
comingSoon: true
category: "Creative Direction"
featured: false
image: "/images/lauren-camera.jpg"
imageAlt: ""
author: "Lauren Huffman"
readingTime: "5 min"
noindex: true
keywords: []
---

Write the essay here. Keep claims grounded in Lauren's real work and perspective — do not invent credentials, client results, or accomplishments.

Official categories: Creative Direction | Photography | Creative Business | Community | Behind the Work

To show a hub teaser while writing: set `draft: false` and keep `comingSoon: true`.
When ready to publish: set `draft: false`, `comingSoon: false`, remove `noindex`, and use `featured: true` on at most one article.
