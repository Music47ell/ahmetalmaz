export const prerender = true

import rss from '@astrojs/rss'
import { getCollection, type CollectionEntry } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import siteMetadata from '../../../data/siteMetadata'
const parser = new MarkdownIt()

export async function getStaticPaths() {
	const content: CollectionEntry<'posts'>[] = await getCollection('posts')
	const tags = [...new Set(content.flatMap((item) => item.data.tags))]

	return tags.map((tag) => ({
		params: { tag: (tag ?? '').replace(/\s+/g, '-').toLowerCase() },
	}))
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
	const content: CollectionEntry<'posts'>[] = await getCollection('posts')

	const tag = context.params.tag
	const filteredBlog = content
		.sort(
			(a, b) => b.data.published_at.getTime() - a.data.published_at.getTime(),
		)
		.filter((item) =>
			(item.data.tags ?? [])
				.map((tag) => tag.replace(/\s+/g, '-').toLowerCase())
				.includes(tag),
		)

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
    <atom:link href="${context.site}blog/feed.xml" rel="self" type="application/rss+xml" />
    `,
		items: filteredBlog
			.sort(
				(a, b) => b.data.published_at.getTime() - a.data.published_at.getTime(),
			)
			.map((item) => ({
				title: item.data.title,
				description: item.data.description,
				pubDate: item.data.published_at,
				link: `/blog/${item.id}`,
				categories: item.data.tags,
				author: `${siteMetadata.name}`,
				content: sanitizeHtml(parser.render(item.body ?? ''), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
				}),
			})),
		stylesheet: '/feed.xsl',
	})
}
