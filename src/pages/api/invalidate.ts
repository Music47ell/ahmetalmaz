// src/pages/api/invalidate.ts
import type { APIRoute } from "astro";
import { invalidatePublicCaches } from "../../libs/fetchWP";

export const POST: APIRoute = async ({ request }) => {
  // 🔑 Validate secret token from header
  const token = request.headers.get("x-webhook-token");
  if (token !== process.env.WP_WEBHOOK_SECRET) {
    console.warn("[Invalidation] Unauthorized webhook attempt");
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    // 📥 Parse JSON payload
    const payload = await request.json();
    const { slug } = payload;

    if (!slug || typeof slug !== "string") {
      return new Response("Missing or invalid 'slug' in payload", { status: 400 });
    }

    // 🧹 Invalidate caches
    await invalidatePublicCaches(slug);

    console.log(`[Invalidation] Cache cleared for slug: ${slug}`);
    return new Response(`Invalidated: ${slug}`, { status: 200 });
  } catch (error) {
    console.error("[Invalidation] Error:", error);
    return new Response("Invalid payload", { status: 400 });
  }
};