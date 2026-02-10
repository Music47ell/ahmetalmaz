import siteMetadata from "../data/siteMetadata";
import {WP_REST_URL} from 'astro:env/server'

type WPPost = {
  slug: string;
  date: string;
  modified?: string;
};

async function fetchAllPosts(): Promise<WPPost[]> {
  const perPage = 100; // max WP allows
  let page = 1;
  let totalPages = 1;
  const allPosts: WPPost[] = [];

  do {
    const res = await fetch(
      `${WP_REST_URL}/all-posts?per_page=${perPage}&page=${page}&_fields=slug,date,modified`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`WP fetch failed on page ${page}`);
    }

    const posts: WPPost[] = await res.json();
    allPosts.push(...posts);

    totalPages = Number(res.headers.get("X-WP-TotalPages")) || 1;
    page++;
  } while (page <= totalPages);

  return allPosts;
}

async function generateSitemap() {
  const posts = await fetchAllPosts();

  return `
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/sitemap.xsl" type="text/xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>${siteMetadata.siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>

  ${posts
    .map(
      (post) => `
  <url>
    <loc>${siteMetadata.siteUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.modified || post.date).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  `
    )
    .join("")}

</urlset>
`.trim();
}

export async function GET() {
  return new Response(await generateSitemap(), {
    status: 200,
    headers: {
      "content-type": "application/xml",
    },
  });
}
