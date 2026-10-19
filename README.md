## Stack

- `Astro` - A fast, flexible new static site framework for the modern web.
- `TypeScript` - A typed superset of JavaScript that compiles to plain JavaScript.
- `Tailwind CSS` - A utility-first CSS framework for rapidly building custom user interfaces.

## Overview

- `assets` - Static assets such as images, favicons, and manifest files.
- `components` - Reusable components.
- `content` - Content for the blog posts and pages.
- `data` - Metadata for the site
- `layouts` - Layouts for the site.
- `lib` - Libraries for the site.
- `pages` - Pages for the site.
- `utils` - Utility functions for the site.

## Deployment

The site runs on a VPS behind a Cloudflare Tunnel, built by GitHub Actions and deployed
by [Dockhand](https://github.com/Finsys/dockhand) through its git webhook.
The stack is defined in [`compose.yaml`](./compose.yaml) and CI in
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

```bash
npm install      # install dependencies
npm run dev      # local dev server on :4321
npm run build    # standalone Node server in dist/server/entry.mjs
npm start        # run the production server
```

## Features

- Easy styling customization with [Tailwind](https://tailwindcss.com/)
- Lightweight
- Mobile-friendly view
- Uses [Turso](https://turso.tech/) for post views
- Automatic image optimization via [astro:assets](https://docs.astro.build/en/guides/images/#images-in-astro-files)
- Pre-configured security headers
- SEO friendly with RSS feed, sitemaps and more!

## Running Locally

```bash
$ git clone https://github.com/Music47ell/ahmetalmaz.git
$ cd ahmetalmaz
$ npm
$ npm run dev
```

## Cloning / Forking

Please review the [license](https://github.com/Music47ell/ahmetalmaz/blob/main/LICENSE) and remove all of my personal information (blog posts, images, etc.).
