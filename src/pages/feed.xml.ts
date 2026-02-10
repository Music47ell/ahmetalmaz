import rss from "@astrojs/rss";
import siteMetadata from "../data/siteMetadata";
import { fetchPublicPostListContent } from "../libs/fetchWP";
import { processPostContent } from "../libs/processPost";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
  const posts = await fetchPublicPostListContent();

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
items: await Promise.all(
  posts.map(async (post: { title: { rendered: string }; excerpt: { markdown: string }; date: string; slug: string; content: { markdown: string } }) => ({
    title: post.title.rendered,
    description: post.excerpt.markdown,
    pubDate: post.date,
    link: `blog/${post.slug}`,
    author: siteMetadata.name,
    content: await processPostContent(post.content.markdown),
  }))
),
    stylesheet: "/feed.xsl",
  });
}