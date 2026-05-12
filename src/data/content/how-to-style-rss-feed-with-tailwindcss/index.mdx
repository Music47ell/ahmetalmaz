---
title: How to Style an RSS Feed with Tailwind CSS
excerpt: Discover how to transform your raw RSS feed into a beautiful, user-friendly page using Tailwind CSS, inspired by Stefan Judis’s human-readable feed. Perfect for developers who value design, accessibility, and the open web
slug: how-to-style-rss-feed-with-tailwindcss
draft: false
category: How To
tags: ['How To', 'Tailwind CSS', 'RSS']
published: 2025-12-22T09:57:00+0300
updated: 2025-12-22T09:57:00+0300
toot: '115971868496836398'
---
I’ve been a longtime fan of **RSS**, since the good old days of Google Reader, because it offers a pleasent reading expeirence across all sites. But most RSS feeds are brutal to look at if you land on them directly in a browser. Raw XML. Angle brackets everywhere. Zero context for newcomers.

That changed for me the day I stumbled upon **[Stefan Judis’s RSS feed](https://www.stefanjudis.com/rss.xml)**.

Unlike the typical `<rss>` dump, Stefan’s feed was **styled**, clean, readable, and welcoming. Right at the top, it explained: *“This is a web feed…”* with a clear call to action for new users. No jargon. No confusion. Just a thoughtful, human-first experience.

As someone who **loves Tailwind CSS**, I immediately thought: *“What if I could do this, but with Tailwind?”*

Turns out, you absolutely can. And in this post, I’ll show you exactly how I combined **XSLT + Tailwind CSS CDN** to turn **[my own RSS feed](https://ahmetalmaz.com/feed.xml)** into a branded, responsive, and educational entry point for new subscribers, all without a build step.

---

## Why Bother Styling Your RSS Feed?

Before Stefan’s feed showed me the light, I assumed RSS was “just for apps.” But that’s a missed opportunity.

- **Not every visitor uses a newsreader.** Many hit `/feed.xml` directly, especially curious readers or fellow devs.
- **You onboard new RSS users.** A short note (like the one on Stefan’s feed) can demystify RSS for beginners.
- **It’s still 100% compatible.** Newsreaders ignore your styling and consume the raw XML just fine.

Stefan’s approach, borrowed from projects like **[pretty-feed.xsl](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl)** from [About Feeds](https://aboutfeeds.com), proved that **RSS doesn’t have to be ugly**. And with Tailwind, I knew I could make it even more flexible and on-brand.

---

## How It Works: XSLT + Tailwind CSS

RSS is XML. Browsers *can* display it, but only as raw markup unless you tell them otherwise.

Enter **XSLT (Extensible Stylesheet Language Transformations)**: a W3C standard that lets you transform XML into HTML.

Here’s the magic setup:

1. Your `feed.xml` includes a processing instruction:  
   ```xml
   <?xml-stylesheet href="/feed.xsl" type="text/xsl"?>
   ```
2. When opened in a browser, it loads `feed.xsl`.
3. The XSLT file converts your RSS into clean HTML, and injects **Tailwind CSS via CDN**.
4. Result? A fully styled, responsive, mobile-friendly feed page, **powered entirely by utility classes**.

Best part? **Zero build tooling.** No PostCSS, no bundler. Just CDNs and smart templating.

---

## My Tailwind-Powered RSS Styling (Step-by-Step)

### ✅ Step 1: Create `feed.xsl`

This file does the heavy lifting. Here’s my full implementation, inspired by Stefan’s clarity, but built with Tailwind’s utility-first philosophy:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="3.0"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title" /> | RSS Feed</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <!-- Tailwind CSS via CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  // Dracula-inspired dark theme
                  draculaBg: "#282a36",
                  draculaText: "#f8f8f2",
                  draculaRed: "#ff5555"
                }
              }
            }
          };
        </script>
        <style>
          body {
            font-family: ui-sans-serif, system-ui, sans-serif;
            line-height: 1.6;
          }
        </style>
      </head>
      <body class="bg-draculaBg text-draculaText max-w-2xl mx-auto p-4">
        <!-- Educational banner (thank you, Stefan & About Feeds!) -->
        <div class="bg-yellow-100 text-draculaBg p-4 rounded mb-6">
          <p><strong>This is a web feed</strong>, also known as an RSS feed.</p>
          <p class="text-sm">
            Subscribe by copying the URL from your address bar into your newsreader.
          </p>
        </div>

        <p class="mb-6">
          New to feeds? Visit 
          <a href="https://aboutfeeds.com" class="text-draculaRed underline">About Feeds</a> 
          to get started. It’s free.
        </p>

        <header class="mb-8 text-center">
          <h1 class="text-2xl font-bold">
            <xsl:value-of select="/rss/channel/title" /> RSS Feed
          </h1>
          <p class="text-gray-400 mt-1">
            <xsl:value-of select="/rss/channel/description" />
          </p>
        </header>

        <!-- Loop through feed items -->
        <xsl:for-each select="/rss/channel/item">
          <article class="mb-8 pb-4 border-b border-gray-800">
            <h2 class="text-xl font-semibold mb-1">
              <a href="{link}" target="_blank" class="text-draculaRed hover:underline">
                <xsl:value-of select="title" />
              </a>
            </h2>
            <p class="text-gray-400 text-sm">
              Published: <xsl:value-of select="pubDate" />
              <xsl:if test="author"> • By <xsl:value-of select="author" /></xsl:if>
            </p>
            <xsl:if test="description">
              <p class="mt-2 text-gray-300">
                <xsl:value-of select="description" disable-output-escaping="yes" />
              </p>
            </xsl:if>
          </article>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

> **Why Tailwind?** I didn’t want to maintain a separate CSS file. With Tailwind’s CDN + custom config, I get responsive spacing, dark-mode-ready colors, and consistent typography, all in a single file.

### ✅ Step 2: Link XSL to Your RSS Feed

In your `feed.xml`, add this **before** the `<rss/>` tag:

```xml
<?xml-stylesheet href="/feed.xsl" type="text/xsl"?>
```

That’s it. No server config. No extra dependencies.

### ✅ Step 3: Deploy & Test

- Open `yoursite.com/feed.xml` → you’ll see a **beautiful, branded page**.
- Subscribe using your favorite RSS reader. Currently, I use FreshRSS → it works **exactly as before**.

---

## Conclusion: Style Your Feed, Honor the Open Web

If you publish a blog, newsletter, or podcast, **you already have an RSS feed**. Don’t let it rot in raw XML purgatory.

Take 15 minutes. Style it. Make it human.

Inspired by Stefan Judis, empowered by Tailwind CSS, and aligned with the ethos of [About Feeds](https://aboutfeeds.com), this tiny upgrade can turn passive visitors into loyal subscribers.

> **Your feed isn’t just for machines, it’s a front door for people.**

So go ahead. Give it a coat of Tailwind. 🎨