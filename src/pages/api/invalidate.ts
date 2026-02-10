import { getContentVersion, bumpContentVersion, bumpPostVersion } from '../../libs/cacheVersions';
import { getCacheClient } from '../../libs/cache';

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get('x-webhook-token');
  if (token !== process.env.WP_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 403 });
  }

  const payload = await request.json();
  const { slugs, event } = payload;

  if (!Array.isArray(slugs)) {
    return new Response("Invalid 'slugs' array", { status: 400 });
  }

  // Always bump content-version for any update, publish, or delete
  await bumpContentVersion();

  // Fetch the current content version dynamically
  const contentVersion = await getContentVersion();
  const cacheKey = `wp:v${contentVersion}:post-list-content`; // Use the dynamic version for the cache key

  // Invalidate the RSS feed cache when a post is updated or published
  if (event === 'post_updated' || event === 'post_published') {
    const cache = await getCacheClient();
    await cache.del(cacheKey);  // Invalidate the cache using the dynamic version
    
    // Bump post version for each updated or new post
    for (const slug of slugs) {
      await bumpPostVersion(slug);
    }
  }

  return new Response(`Cache bumped for slugs: ${slugs.join(', ')}, event: ${event}`);
};
