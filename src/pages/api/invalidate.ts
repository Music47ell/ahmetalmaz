import type { APIRoute } from 'astro';
import { bumpContentVersion, bumpPostVersion } from '../../libs/cacheVersions';

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

  if (event === 'post_updated') {
    for (const slug of slugs) await bumpPostVersion(slug);
    return new Response(`Post cache bumped: ${slugs.join(', ')}`);
  }

  // post published or deleted
  await bumpContentVersion();
  return new Response('Content cache bumped');
};
