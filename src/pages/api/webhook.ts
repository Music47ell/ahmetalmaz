import { processPostContent } from "../../libs/processPost";

// KV fallback for local dev
const kv =
  typeof CACHE_KV !== "undefined"
    ? CACHE_KV
    : new Map<string, string>();

async function kvDelete(key: string) {
  if (kv instanceof Map) {
    kv.delete(key);
  } else {
    await kv.delete(key);
  }
}

async function kvPut(key: string, value: any) {
  const json = JSON.stringify(value);
  if (kv instanceof Map) {
    kv.set(key, json);
  } else {
    await kv.put(key, json);
  }
}

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

    // Invalidate caches
    await kvDelete(`post:${slug}`);
    await kvDelete("home:posts");

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

    await kvPut(`post:${slug}`, { post, content, timestamp: Date.now() });

    return new Response("Cache updated", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error processing webhook", { status: 500 });
  }
}
