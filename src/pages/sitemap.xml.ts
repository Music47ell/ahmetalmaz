import siteMetadata from '../data/siteMetadata'
import { API_BASE_URL } from 'astro:env/client'
import { BLOG_TOKEN } from 'astro:env/server'

type Post = {
	frontmatter: {
		slug: string
		published: string
		updated?: string
	}
}

async function fetchAllPosts(): Promise<Post[]> {
	const res = await fetch(`${API_BASE_URL}/blog`, {
		cache: 'no-store',
		headers: BLOG_TOKEN ? { Authorization: `Bearer ${BLOG_TOKEN}` } : {},
	})

	if (!res.ok) {
		throw new Error(`API fetch failed: ${res.status}`)
	}

	return res.json()
}

async function generateSitemap() {
	const posts = await fetchAllPosts()

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
    <loc>${siteMetadata.siteUrl}/blog/${post.frontmatter.slug}</loc>
    <lastmod>${new Date(post.frontmatter.updated || post.frontmatter.published).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  `,
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
