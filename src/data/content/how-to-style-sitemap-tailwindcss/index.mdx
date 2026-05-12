---
title: How to Style a Sitemap with Tailwind CSS
excerpt: Sitemaps are built for search engines, not humans, but that doesn’t mean they have to be unreadable. In this post, I show how I style my sitemap using XSL and Tailwind CSS, why Yoast does the same thing, and how to implement it cleanly with Astro without breaking SEO.
slug: how-to-style-sitemap-tailwindcss
draft: false
category: How To
tags: ['How To', 'Tailwind CSS', 'Sitemap']
published: 2025-12-26T18:42:00+0300
updated: 2025-12-26T18:42:00+0300
toot: '115971872422604144'
---
Let’s get this out of the way first: **sitemaps are for search engines, not humans**.
Google reads XML just fine. Bing doesn’t care about fonts. Crawlers don’t need Tailwind CSS.

And yet, I still [style my sitemap](https://ahmetalmaz.com/sitemap.xml).

This article explains **how to style a sitemap with Tailwind CSS**, **why I bother doing it**, and **how I implemented it using XSL and Astro**.

I’ve already explored this pattern before in my article on [How to Style an RSS Feed with Tailwind CSS](https://ahmetalmaz.com/blog/how-to-style-rss-feed-with-tailwindcss), where I used Tailwind and XML transforms to make a machine-readable RSS feed human-friendly.

---

## Why Style a Sitemap XML File?

Most developers treat `/sitemap.xml` as a dead file. Generate it, submit it to Google Search Console, forget it exists.

That mindset misses a few realities:

* Humans *do* open sitemaps
* SEO audits involve sitemaps
* Debugging broken URLs is easier when things are readable
* First impressions still matter, even for technical files

Lots of companies out there do this. For example: [Yoast](https://yoast.com/sitemap_index.xml), [Apple](https://www.apple.com/sitemap/), [Microsoft](https://www.microsoft.com/en-us/sitemap) and more.

These sitemaps are:

* Styled
* Readable
* Use XSL to transform XML into HTML

Styling a sitemap **does not improve rankings directly**, but it dramatically improves **readability, clarity, and professionalism**.

---

## How Sitemap Styling Actually Works

You **do not style the XML directly**.

Instead, you attach an **XSL stylesheet** to your sitemap. Search engines ignore it. Browsers respect it.

That’s the key.

This single line makes everything possible:

```xml
<?xml-stylesheet href="/sitemap.xsl" type="text/xsl"?>
```

When:

* Googlebot hits your sitemap → it reads raw XML
* A human opens your sitemap → the XSL renders styled HTML

Zero SEO downside. Zero risk.

Here’s an example that uses **Astro** and TypeScript:

```ts ins={9} showLineNumbers title='sitemap.xml.ts'
import { getCollection } from 'astro:content'
import siteMetadata from '../data/siteMetadata'

async function generateSitemap() {
  const content = await getCollection('posts')

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet href="/sitemap.xsl" type="text/xsl"?>
    <urlset
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    >
      <url>
        <loc>${siteMetadata.siteUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
      </url>

      ${content
        .sort(
          (a, b) =>
            new Date(b.data.published_at).getTime() -
            new Date(a.data.published_at).getTime()
        )
        .map(
          (post) => `
        <url>
          <loc>${siteMetadata.siteUrl}/blog/${post.id}</loc>
          <lastmod>${new Date(post.data.published_at).toISOString()}</lastmod>
          <priority>0.80</priority>
        </url>
      `
        )
        .join('')}
    </urlset>
  `.trim()
}

export async function GET() {
  return new Response(await generateSitemap(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
    },
  })
}
```

This produces a **fully valid sitemap.xml** that search engines love, and humans can actually read once styled.

---

## Styling the Sitemap with XSL and Tailwind CSS

This is where things get interesting.

The `sitemap.xsl` file transforms raw XML into structured HTML and applies **Tailwind CSS utility classes**. I treat it like a minimal webpage.

### Why Tailwind CSS Works Here

* No build step
* CDN-based
* Utility-first = clean markup
* Easy typography and spacing
* Zero maintenance

I load Tailwind directly inside the XSL file:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Then I extend the theme with my own colors.

Inside `sitemap.xsl`, I:

* Define HTML structure
* Add meta tags and viewport
* Use Tailwind for layout and typography
* Loop through `<url>` nodes
* Render links and last-modified dates

```xml {18-34} showLineNumbers title='sitemap.xsl'
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>Sitemap</title>

        <meta charset="utf-8" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <!-- Tailwind CSS via CDN -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Tailwind config -->
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  draculaLc: "#E30A17",
                  draculaTc: "#282a36",
                  draculaBg: "#282a36",
                },
              },
            },
          };
        </script>
      </head>

      <body
        class="bg-draculaBg font-sans text-base leading-6 text-zinc-700 max-w-[60ch] mx-auto p-4"
      >
        <!-- Info banner -->
        <nav class="mb-6">
          <div class="bg-yellow-200 px-4 py-3 mb-2 rounded">
            <p class="font-semibold">This is a sitemap</p>
            <p class="text-sm">
              It is generated automatically using a script written in JavaScript.
            </p>
          </div>

          <p class="text-zinc-400 text-sm">
            Learn more about sitemaps at
            <a
              href="https://www.sitemaps.org/"
              class="text-draculaLc underline"
              target="_blank"
            >
              sitemaps.org
            </a>
          </p>
        </nav>

        <!-- Header -->
        <header class="mb-6">
          <h1 class="text-2xl font-semibold text-white">
            Sitemap
          </h1>

          <hr class="my-4 border-zinc-600" />
        </header>

        <!-- Sitemap URLs -->
        <xsl:for-each select="/sitemap:urlset/sitemap:url">
          <div class="pb-5">
            <h2 class="text-lg font-medium">
              <a class="text-draculaLc break-all" target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="sitemap:loc" />
                </xsl:attribute>
                <xsl:value-of select="sitemap:loc" />
              </a>
            </h2>

            <p class="text-sm text-zinc-400">
              Last updated:
              <xsl:value-of select="substring(sitemap:lastmod, 1, 10)" />
            </p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

Each sitemap entry becomes a readable block instead of a wall of XML.

Humans can scan it. Developers can debug it. Clients don’t panic when they open it.

---

## Conclusion: Style the Sitemap Anyway

Even though sitemaps are built for search engines, **humans still interact with them**.

Using **XSL**, **Tailwind CSS**, and **Astro**, I get:

* A valid XML sitemap for crawlers
* A styled HTML view for humans
* Zero SEO drawbacks
* Maximum clarity

If Yoast styles their sitemap, I’m more than comfortable doing the same.

And now, you know exactly how to do it too.
