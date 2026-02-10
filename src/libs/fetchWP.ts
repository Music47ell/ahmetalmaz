import { getCacheClient } from './cache';
import { getContentVersion, getPostVersion } from './cacheVersions';

const TTL = import.meta.env.DEV ? 30 : 31_536_000;
const PREVIEW_TTL = 3600;

// ————— LIST / RSS / INDEX —————
export async function fetchPublicPostList({ page = 1, perPage = 10 } = {}) {
  const cache = await getCacheClient();
  const v = await getContentVersion();
  const key = `wp:v${v}:post-list:${page}:${perPage}`;

  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${import.meta.env.WP_REST_URL}/all-posts?orderby=date&order=desc&page=${page}&per_page=${perPage}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();

  await cache.setex(key, TTL, JSON.stringify(posts));
  return posts;
}

export async function fetchTotalPostCount() {
  const cache = await getCacheClient();
  const v = await getContentVersion();
  const key = `wp:v${v}:post-count`;

  const cached = await cache.get(key);
  if (cached) return Number(cached);

  const res = await fetch(`${import.meta.env.WP_REST_URL}/all-posts?per_page=1`);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const total = Number(res.headers.get("X-WP-Total") || 0);

  await cache.setex(key, TTL, total.toString());
  return total;
}

export async function fetchPublicPostListContent() {
  const cache = await getCacheClient();
  const v = await getContentVersion();
  const key = `wp:v${v}:post-list-content`;

  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${import.meta.env.WP_REST_URL}/all-posts?_fields=slug,title.rendered,excerpt.markdown,date,modified,content.markdown`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();

  await cache.setex(key, TTL, JSON.stringify(posts));
  return posts;
}

// ————— SINGLE POST —————
export async function fetchPublicPostBySlug(slug: string) {
  const cache = await getCacheClient();
  const [cv, pv] = await Promise.all([getContentVersion(), getPostVersion(slug)]);
  const key = `wp:v${cv}:post:${slug}:v${pv}`;

  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const res = await fetch(`${import.meta.env.WP_REST_URL}/all-posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,date,modified,title.rendered,content.markdown,excerpt.markdown,readingTime,wordCount,mastodon_status,relatedPosts`);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const post = (await res.json())[0] ?? null;

  await cache.setex(key, post ? TTL : 60, JSON.stringify(post));
  return post;
}

// ————— PREVIEW FETCHERS —————
function getAuthHeader() {
  const token = Buffer.from(`${import.meta.env.WP_USERNAME}:${import.meta.env.WP_APP_PASSWORD}`).toString('base64');
  return `Basic ${token}`;
}

export async function fetchPreviewPostById(id: string) {
  const url = `${import.meta.env.WP_REST_URL}/all-posts/${id}?context=edit`;
  const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  return res.json();
}

export async function fetchPreviewPostBySlug(slug: string) {
  const url = `${import.meta.env.WP_REST_URL}/all-posts?slug=${encodeURIComponent(slug)}&context=edit`;
  const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  const posts = await res.json();
  return posts[0] || null;
}

// ————— PREVIEW STORAGE —————
export async function storePreviewData(data: any): Promise<string> {
  const previewId = crypto.randomUUID();
  const cache = await getCacheClient();
  await cache.setex(`preview:${previewId}`, PREVIEW_TTL, JSON.stringify(data));
  return previewId;
}

export async function getPreviewData(previewId: string) {
  const cache = await getCacheClient();
  const data = await cache.get(`preview:${previewId}`);
  return data ? JSON.parse(data) : null;
}
