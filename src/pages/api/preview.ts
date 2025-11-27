import type { APIRoute } from "astro";
import { fetchPreviewPostById, storePreviewData } from "../../libs/fetchWP";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get("post");
  if (!postId) return new Response("Missing post ID", { status: 400 });

  try {
    const post = await fetchPreviewPostById(postId);
    const previewId = await storePreviewData(post);
    
    const redirectUrl = new URL(`/preview/${post.slug}`, url.origin);
    redirectUrl.searchParams.set("preview", previewId);
    return Response.redirect(redirectUrl.toString(), 302);
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};