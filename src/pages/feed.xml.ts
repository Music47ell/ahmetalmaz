import rss from '@astrojs/rss'
import siteMetadata from '../data/siteMetadata'
import { fetchPublicPostListContent } from '../libs/fetchAPI'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
	const posts = await fetchPublicPostListContent()

	return rss({
		title: siteMetadata.name,
		description: siteMetadata.description,
		site: context.site,
		trailingSlash: false,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
			content: 'http://purl.org/rss/1.0/modules/content/',
		},
		customData: `
      <language>${siteMetadata.locale}</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <webMaster>${siteMetadata.name}</webMaster>
      <managingEditor>${siteMetadata.name}</managingEditor>
      <atom:link href="${context.site}/feed.xml" rel="self" type="application/rss+xml" />
    `,
		items: posts.map(
			(post: {
				frontmatter: {
					title: string
					excerpt: string
					published: string
					slug: string
				}
				content: string
			}) => ({
				title: post.frontmatter.title,
				description: post.frontmatter.excerpt,
				pubDate: new Date(post.frontmatter.published),
				link: `blog#${post.frontmatter.slug}`,
				author: siteMetadata.name,
				content: post.content ?? '',
			}),
		),
		stylesheet: '/feed.xsl',
	})
}
