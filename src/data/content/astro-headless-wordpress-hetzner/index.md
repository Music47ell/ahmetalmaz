---
title: Self-Hosting My Astro Site with Headless WordPress on Hetzner
excerpt: Here's why I moved to using a headless WordPress with my Astro site. 
slug: astro-headless-wordpress-hetzner
draft: false
category: How To
tags: ['How To', 'Hetzner', 'Docker', 'GitHub', 'WordPress']
published: 2025-12-02T08:20:00+0300
updated: 2025-12-02T08:20:00+0300
toot: '115971833901413907'
---
I’ve rebuilt my website so many times it’s basically a hobby at this point. The whole thing started as a **simple static Astro site running on Cloudflare Workers**, and at the time that felt clever enough. But static files get boring. I eventually wanted dynamic content, a real CMS, and full control over where and how everything runs.

So I tore the whole thing down and rebuilt it as a **Headless WordPress + Astro SSR** setup. Then I put the entire system into Docker containers, automated deployments with GitHub Actions, pushed images to GHCR, and hosted the entire stack on a dedicated [Hetzner](https://ahmetalmaz.com/go/hetzner) server. Now it’s fast, modular, fully self-hosted, and deploys itself every time I push to `main`.

This wasn’t just an upgrade, it was a complete evolution of the project.

---

## **Why I ditched Cloudflare Workers and switched to Hetzner**

Cloudflare Workers are great for low-cost static sites, but they’re too limited once you want a real backend. I wanted:

* dynamic content
* a proper headless CMS
* server-side rendering
* Docker-based deployments
* background tasks
* long-term control over the full environment

I wanted a real server, one I could actually control.

Hetzner solved all of that instantly. Cheap. Fast. Predictable. Root access. Enough horsepower to run WordPress, Caddy, Astro SSR, databases, analytics, and whatever else I throw at it. A proper home for a self-hosted ecosystem.

---

## **Why I switched to Headless WordPress**

Markdown posts inside the Astro repo were fine until they weren’t.

I wanted:

* scheduled posts
* drafts
* an editorial workflow
* dynamic content without redeploying

Headless WordPress gives me all of that without forcing me into traditional PHP theming hell. The backend stores content. Astro handles rendering. The frontend stays modern and fast.

WordPress powers the API. Astro consumes the API. Everything lives inside Docker on Hetzner.

It just works.

---

## **How Astro SSR fetches content from WordPress**

The Astro SSR frontend talks directly to WordPress using the REST API. That means:

* When I publish a post in WordPress → the site updates instantly
* When I tweak the design → GitHub Actions rebuilds the frontend

No rebuilds for new content. No weird caching issues. Just real-time content and fast rendering.

The dynamic flexibility of WordPress, combined with the speed of Astro, is a sweet spot for self-hosted setups.

---

## **Fully automated CI/CD with GitHub Actions and GHCR**

Whenever I update the front end, GitHub Actions takes over:

1. Installs Bun
2. Builds the Astro SSR frontend
3. Creates a Docker image
4. Pushes it to GitHub Container Registry

Here’s the workflow powering it:

```yml
name: Build and Push Astro SSR Site

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Compute lowercase repo name
        run: echo "REPO=${GITHUB_REPOSITORY@L}" >> $GITHUB_ENV

      - name: Install + build
        run: |
          bun install
          bun run build

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_PAT }}

      - name: Build image
        run: docker build -t ghcr.io/${{ env.REPO }}/container:latest .

      - name: Push image
        run: docker push ghcr.io/${{ env.REPO }}/container_name:latest
```

It’s clean, automated, and fully controlled by me.

---

## **The Dockerfile powering the Astro SSR frontend**

Using Bun for max speed:

```txt
FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

EXPOSE 4321

CMD ["bun", "run", "start"]
```

This Dockerfile gives me a consistent environment whether I run it locally or deploy it on Hetzner. SSR always pulls fresh content from WordPress at runtime.

---

## **The Docker Compose setup on Hetzner**

```yml
services:
  astro_site:
    image: ghcr.io/username/reponame/container_name:latest
    container_name: container_name
    restart: unless-stopped
    environment:
      PUBLIC_UMAMI_ID: ${PUBLIC_UMAMI_ID}
      PUBLIC_UMAMI_URL: ${PUBLIC_UMAMI_URL}
```

WordPress runs in its own stack with MariaDB.

Hetzner turns the whole system into a stable, self-contained hosting environment.

---

## **Daily workflow now**

Life with this new stack is smooth:

* WordPress runs on Hetzner and manages all my content
* Astro SSR fetches posts dynamically
* Docker keeps everything clean and isolated
* GHCR stores all my production images
* GitHub Actions handles every deployment
* Hetzner keeps the entire thing fast and reliable

I went from a static site on Cloudflare Workers to a full headless CMS running on a dedicated server with a modern deployment pipeline.

---

## **Conclusion**

Migrating from a static Cloudflare Worker site to a **Headless WordPress + Astro SSR** setup hosted on **Hetzner** was the best move I’ve made for this project. I now get:

* full CMS editing power
* fast SSR performance
* complete control through Docker
* automated deployments
* cheap but powerful hosting

The stack is modern, flexible, and built to handle anything I decide to add down the line. And because everything runs on my own [Hetzner](https://ahmetalmaz.com/go/hetzner) hardware.

Next up I’ll probably work on background rebuild triggers, WordPress webhooks, or maybe a live preview system. Once you start going down the self-hosting rabbit hole, it’s hard to stop digging.