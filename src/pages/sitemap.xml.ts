import siteMetadata from "../data/siteMetadata";

async function generateSitemap() {
  const baseUrl = process.env.WP_REST_URL;
  if (!baseUrl) throw new Error("WP_REST_URL is not set!");

  // Fetch posts via WP REST API
  const response = await fetch(`${baseUrl}/posts?_fields=slug,date,modified`);
  const posts = await response.json();

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet href="/sitemap.xsl" type="text/xsl"?>
    <urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      
      <url>
        <loc>${siteMetadata.siteUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.00</priority>
      </url>

      ${posts
        .map(
          (post: any) => `
          <url>
            <loc>${siteMetadata.siteUrl}/blog/${post.slug}</loc>
            <lastmod>${new Date(post.modified || post.date).toISOString()}</lastmod>
            <priority>0.80</priority>
          </url>
        `.trim()
        )
        .join("")}

    </urlset>
  `.trim();
}

export async function GET() {
  const sitemap = await generateSitemap();
  return new Response(sitemap, {
    status: 200,
    headers: {
      "content-type": "application/xml",
    },
  });
}
