// src/pages/api/preview.ts
import type { APIRoute } from "astro";
import { fetchWpPostById } from "../../libs/fetchWpPost";

const previews: Record<string, any> = {};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get("post");

  if (!postId) return new Response("Missing post ID", { status: 400 });

  try {
    const post = await fetchWpPostById(postId);

    // Save in-memory
    const previewId = crypto.randomUUID();
    previews[previewId] = post;

    // Build absolute URL for redirect
    const redirectUrl = new URL(`/preview/${post.slug}`, url.origin);
    redirectUrl.searchParams.set("preview", previewId);

    return Response.redirect(redirectUrl.toString(), 302);
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};

export function getPreviewById(id: string) {
  return previews[id];
}
