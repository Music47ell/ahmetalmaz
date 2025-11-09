import { processPostContent } from "../../libs/processPost";

export async function onRequestPost(context) {
  try {
    // Verify secret token
    const token = context.request.headers.get("x-webhook-token");
    if (token !== import.meta.env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await context.request.json();
    const { slug, event } = body;

    if (!slug || !event) return new Response("Invalid payload", { status: 400 });

    // Invalidate single post cache
    await CACHE_KV.delete(`post:${slug}`);

    // Invalidate blog index cache
    await CACHE_KV.delete("home:posts");

    // Optional: pre-fetch fresh content
    const response = await fetch(import.meta.env.WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query SinglePost($slug: ID!) {
            post(id: $slug, idType: SLUG) {
              title
              excerpt
              readingTime
              wordCount
              slug
              date
              modified
              content
            }
          }
        `,
        variables: { slug },
      }),
    });

    const json = await response.json();
    const post = json.data.post;
    const content = await processPostContent(post.content);

    await CACHE_KV.put(`post:${slug}`, JSON.stringify({ post, content, timestamp: Date.now() }));

    return new Response("Cache updated", { status: 200 });
  } catch (err) {
    return new Response("Error processing webhook", { status: 500 });
  }
}
