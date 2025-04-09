export const prerender = true

import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import siteMetadata from '../data/siteMetadata'
const parser = new MarkdownIt()

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
	const content: CollectionEntry<'posts'>[] = await getCollection('posts')

	return rss({
		title: siteMetadata.name,
		description: siteMetadata.description,
		site: context.site,
		trailingSlash: false,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
		},
		customData: `
    <language>${siteMetadata.locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <webMaster>${siteMetadata.name}</webMaster>
    <managingEditor>${siteMetadata.name}</managingEditor>
    <atom:link href="${context.site}/feed.xml" rel="self" type="application/rss+xml" />
    `,
		items: content
			.sort(
				(a, b) =>
					new Date(b.data.published_at).getTime() -
					new Date(a.data.published_at).getTime(),
			)
			.map((item) => {
				return {
					title: item.data.title,
					description: item.data.description,
					pubDate: item.data.published_at,
					link: `blog/${item.id}`,
					categories: item.data.tags,
					author: `${siteMetadata.name}`,
					content: sanitizeHtml(parser.render(item.body ?? ''), {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
					}),
				}
			}),

		stylesheet: '/feed.xsl',
	})
}
