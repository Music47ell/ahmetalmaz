import siteMetadata from '@/data/siteMetadata'

import { getCollection } from 'astro:content'

async function generateSitemap() {
	const content = await getCollection('content')

	return `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet href="/sitemap.xsl" type="text/xsl"?>
    <urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <url>
        <loc>${siteMetadata.siteUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>${siteMetadata.siteUrl}/tags</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
    </url>
    ${content
			.sort((a, b) => {
				return (
					new Date(b.data.published_at).getTime() -
					new Date(a.data.published_at).getTime()
				)
			})
			.map((page) => {
				return `
            <url>
                <loc>${siteMetadata.siteUrl}/${page.id}</loc>
                <lastmod>${new Date(page.data.published_at).toISOString()}</lastmod>
                <priority>0.80</priority>
            </url>
        `.trim()
			})
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
