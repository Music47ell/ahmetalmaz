import rss from "@astrojs/rss"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import siteMetadata from "../data/siteMetadata"

const parser = new MarkdownIt()

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
	const response = await fetch(process.env.WP_GRAPHQL_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			query: `
        query AllPosts {
          posts(where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              slug
              title
              excerpt
              date
              modified
              content
            }
          }
        }
      `,
		}),
	})

	const json = await response.json()
	const posts = json.data.posts.nodes

	return rss({
		title: siteMetadata.name,
		description: siteMetadata.description,
		site: context.site,
		trailingSlash: false,
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},
		customData: `
      <language>${siteMetadata.locale}</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <webMaster>${siteMetadata.name}</webMaster>
      <managingEditor>${siteMetadata.name}</managingEditor>
      <atom:link href="${context.site}/feed.xml" rel="self" type="application/rss+xml" />
    `,
		items: posts.map((post: any) => {
			return {
				title: post.title,
				description: post.excerpt,
				pubDate: post.date,
				link: `blog/${post.slug}`,
				author: siteMetadata.name,
				content: sanitizeHtml(parser.render(post.content ?? ""), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			}
		}),
		stylesheet: "/feed.xsl",
	})
}
