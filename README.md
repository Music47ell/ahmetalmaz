## Stack

- `Astro` - A fast, flexible new static site framework for the modern web.
- `TypeScript` - A typed superset of JavaScript that compiles to plain JavaScript.
- `Tailwind CSS` - A utility-first CSS framework for rapidly building custom user interfaces.
- `Drizzle ORM` - A lightweight and simple ORM for Node.js that supports multiple databases.
- `Turso` - A Fast, Easy and Cheap Database.
- `Cloudflare Pages` - A JAMstack platform for frontend developers.

## Overview

- `assets` - Static assets such as images, favicons, and manifest files.
- `components` - Reusable components.
- `content` - Content for the blog posts and pages.
- `data` - Metadata for the site
- `layouts` - Layouts for the site.
- `libs` - Libraries for the site.
- `pages` - Pages for the site.
- `utils` - Utility functions for the site.

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

## Database Schema

```sql
CREATE TABLE analytics (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, date TIMESTAMP WITH TIME ZONE NOT NULL, title VARCHAR NOT NULL, slug VARCHAR NOT NULL, referrer VARCHAR, flag VARCHAR, country VARCHAR, city VARCHAR, latitude DECIMAL, longitude DECIMAL)
```

## Cloning / Forking

Please review the [license](https://github.com/Music47ell/ahmetalmaz/blob/main/LICENSE) and remove all of my personal information (blog posts, images, etc.).
