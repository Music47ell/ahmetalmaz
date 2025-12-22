import { getCacheClient } from './cache';

export async function getContentVersion() {
  const cache = await getCacheClient();
  return (await cache.get('wp:content-version')) || '1';
}

export async function getPostVersion(slug: string) {
  const cache = await getCacheClient();
  return (await cache.get(`wp:post-version:${slug}`)) || '1';
}

export async function bumpContentVersion() {
  const cache = await getCacheClient();
  await cache.incr('wp:content-version');
}

export async function bumpPostVersion(slug: string) {
  const cache = await getCacheClient();
  await cache.incr(`wp:post-version:${slug}`);
}
