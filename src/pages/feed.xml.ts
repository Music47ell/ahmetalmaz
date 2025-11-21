import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import siteMetadata from "../data/siteMetadata";

const parser = new MarkdownIt();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
  // Fetch posts via WP REST API
  const response = await fetch(`${process.env.WP_REST_URL}/posts?_fields=slug,title,excerpt,date,modified,content`);
  const posts = await response.json();

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
    items: posts.map((post: any) => ({
      title: post.title.rendered,
      description: post.excerpt.rendered,
      pubDate: post.date,
      link: `blog/${post.slug}`,
      author: siteMetadata.name,
      content: sanitizeHtml(parser.render(post.content.rendered ?? ""), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
    stylesheet: "/feed.xsl",
  });
}
