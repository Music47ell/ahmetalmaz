---
title: How I Built a WordPress Preview System in Astro for a Headless Blog
excerpt: I explain how I implemented a WordPress preview system in Astro for my headless WordPress site, including why previews are tricky, how Astro API routes solve the problem, and the exact steps I used to preview unpublished posts securely.
slug: astro-wordpress-preview-headless
draft: false
category: How To
tags: ['How To', 'Astro', 'WordPress']
published: 2025-12-19T08:21:00+0300
updated: 2025-12-19T08:21:00+0300
toot: '115971845029302465'
---
After writing my article *“Self-Hosting My [Astro Site with Headless WordPress](https://ahmetalmaz.com/blog/astro-headless-wordpress-hetzner) on Hetzner”*, I ran into the next real problem every headless WordPress setup eventually hits: **previews**.

Published posts were easy. Astro builds them, WordPress serves the content, life is good. But previews? WordPress editors expect that shiny “Preview” button to just work. In a headless WordPress + Astro setup, it absolutely does not, unless you build it yourself.

So I did.

This article explains **why WordPress previews break in headless setups**, **how I wired previews into Astro**, and **the exact steps and files involved**. This is practical, no-nonsense, production-ready stuff.

---

## Why WordPress Previews Are Hard in Astro

In a traditional WordPress theme, previews are trivial. WordPress renders everything server-side, knows who you are, and shows draft content instantly.

In a headless WordPress setup, none of that exists.

Astro:

* Is static-first
* Doesn’t know about WordPress sessions
* Can’t directly render draft posts without authentication
* Has no idea what a “preview” even means

WordPress previews require:

* Access to **unpublished content**
* Authentication via the REST API
* A way to **bridge WordPress → Astro**

Without a preview system, you’re flying blind.

---

## How I Designed My Astro + WordPress Preview System

The solution uses three core ideas:

1. **WordPress calls Astro**, not the other way around
2. **Astro API routes act as the preview gateway**
3. **Preview pages fetch draft content securely**

The flow looks like this:

WordPress → Astro API route → Astro preview page → WordPress REST API

No plugins. No hacks. Just clean Astro + WordPress REST API integration.

---

## Step 1: The Astro API Preview Endpoint

This is where WordPress sends preview requests:

```
/src/pages/api/preview.ts
```

This route:

* Receives a WordPress post ID
* Fetches the draft post using the REST API
* Redirects to the Astro preview page

```ts
import type { APIRoute } from "astro";
import { fetchPreviewPostById } from "../../lib/fetchWP";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get("post");

  if (!postId) {
    return new Response("Missing post ID", { status: 400 });
  }

  try {
    const post = await fetchPreviewPostById(postId);

    const redirectUrl = new URL(`/preview/${post.slug}`, url.origin);
    redirectUrl.searchParams.set("post", postId);

    return Response.redirect(redirectUrl.toString(), 302);
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
```

This endpoint is the **bridge between WordPress and Astro**. WordPress doesn’t need to know how Astro works. It just redirects.

---

## Step 2: Creating the Astro Preview Page

This file handles rendering preview content:

```
/src/pages/preview/[...slug].astro
```

This page does two things:

* Reads a `preview` query parameter
* Fetches the draft post from WordPress
* Renders it like a normal article

```astro
---
import ContentLayout from "../../layouts/ContentLayout.astro";
import { processPostContent } from "../../lib/processPost";
import { fetchPreviewPostBySlug } from "../../lib/fetchWP";

const { slug } = Astro.params;

if (!slug) {
  throw new Error("Missing slug");
}

const post = await fetchPreviewPostBySlug(slug);

const content = await processPostContent(post.content.rendered);
---

<ContentLayout
  title={post.title.rendered}
  description={post.excerpt?.rendered ?? ""}
  published_at={post.date}
  lastModified={post.modified}
  slug={post.slug}
>
  <div set:html={content} />
</ContentLayout>
```

This page behaves like a normal post page, but it can render **draft WordPress posts**, which is the whole point.

---

## Step 3: Fetching Draft Posts from WordPress

All preview data comes from the WordPress REST API using `context=edit`, which allows access to drafts.

```
/src/lib/fetchWP.ts
```

```ts
function getAuthHeader() {
  const token = Buffer.from(
    `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
  ).toString('base64');
  return `Basic ${token}`;
}

export async function fetchPreviewPostById(id: string) {
  const url = `${process.env.WP_REST_URL}/posts/${id}?context=edit`;

  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() }
  });

  if (!res.ok) {
    throw new Error(`Preview failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchPreviewPostBySlug(slug: string) {
  const url = `${process.env.WP_REST_URL}/posts?slug=${encodeURIComponent(slug)}&context=edit`;

  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() }
  });

  if (!res.ok) {
    throw new Error(`Preview failed: ${res.status}`);
  }

  const posts = await res.json();
  return posts[0] || null;
}
```

This is straight REST API usage. No WordPress plugins required beyond authentication.

---

## Step 4: Redirect WordPress Previews to Astro

Use this filter to point WordPress preview links to your Astro API:

```php
add_filter('preview_post_link', function($link, $post) {
  return 'http://localhost:4321/api/preview?post=' . $post->ID;
}, 10, 2);
```

**Where to put it:**

* In your theme’s `functions.php` **or**
* As a small mu-plugin (`wp-content/mu-plugins/astro-preview.php`)

This makes the WordPress **Preview** button open your Astro preview route instead of the default WordPress preview.

---

## A Simple ContentLayout.astro

Here’s a **basic, clean layout**, no magic, no extras:

```astro
---
const {
  title,
  description,
  published_at,
  lastModified,
  slug
} = Astro.props;
---

<article>
  <header>
    <h1>{title}</h1>
    {description && <p set:html={description} />}
    <small>
      Published: {published_at} | Updated: {lastModified}
    </small>
  </header>

  <section>
    <slot />
  </section>
</article>
```

This keeps previews visually consistent with published posts.

---

## A Simple processPost.ts

No caching. No transforms. Just minimal processing.

```ts
export async function processPostContent(html: string) {
  return html;
}
```

You can extend this later with syntax highlighting, embeds, or markdown transforms, but previews don’t need complexity.

---

## Why This Approach Works

This setup:

* Preserves WordPress editor previews
* Keeps Astro fully headless
* Avoids WordPress theme lock-in
* Works with drafts, and updates
* Scales cleanly as content grows

Most importantly, it respects reality: **headless WordPress needs custom preview logic**. There’s no shortcut around that.

---

## Conclusion

Headless WordPress with Astro is fast, clean, and flexible, but previews don’t come for free. You have to design them intentionally.

By using Astro API routes, WordPress REST API authentication, and a dedicated preview page, I ended up with a preview system that feels native to WordPress editors and stays true to Astro’s architecture.

This is the missing piece that turns a headless WordPress blog from “technically impressive” into **actually usable**.
