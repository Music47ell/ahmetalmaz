import type { APIRoute } from "astro";
import { invalidatePublicCaches } from "../../libs/fetchWP";

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("x-webhook-token");
  if (token !== process.env.WP_WEBHOOK_SECRET) {
    console.warn("[Invalidation] Unauthorized webhook attempt");
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const payload = await request.json();
    const { slugs } = payload;

    if (!slugs || !Array.isArray(slugs) || slugs.some(s => typeof s !== "string")) {
      return new Response("Invalid 'slugs' array", { status: 400 });
    }

    // Invalidate each slug + lists + full content
    await invalidatePublicCaches(slugs);

    console.log(`[Invalidation] Cache cleared for slugs: ${slugs.join(', ')}`);
    return new Response(`Invalidated: ${slugs.join(', ')}`, { status: 200 });
  } catch (error) {
    console.error("[Invalidation] Error:", error);
    return new Response("Invalid payload", { status: 400 });
  }
};
