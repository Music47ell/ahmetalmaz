// src/libs/fetchWP.ts
import { getCacheClient } from './cache';

// ————— CONFIG —————
const PUBLIC_TTL = process.env.DEV ? 30 : 7200; // seconds
const PREVIEW_TTL = 3600; // 1h

// ————— CACHE KEYS —————
const keyListPage = (page: number, perPage: number) => `wp:post-list:page-${page}:per-${perPage}`;
const keyListContent = 'wp:post-list-content';
const keyTotalCount = 'wp:post-count';
const keyPostSlug = (slug: string) => `wp:post:slug:${slug}`;
const keyPreview = (previewId: string) => `preview:${previewId}`;

// ————— PUBLIC FETCHERS —————
export async function fetchPublicPostList({ page = 1, perPage = 10 } = {}) {
  const cache = await getCacheClient();
  const key = keyListPage(page, perPage);
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${process.env.WP_REST_URL}/all-posts?orderby=date&order=desc&_fields=slug,title.rendered,id&page=${page}&per_page=${perPage}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();

  await cache.setex(key, PUBLIC_TTL, JSON.stringify(posts));
  return posts;
}

export async function fetchTotalPostCount() {
  const cache = await getCacheClient();
  const cached = await cache.get(keyTotalCount);
  if (cached) return Number(cached);

  const url = `${process.env.WP_REST_URL}/all-posts?per_page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const total = Number(res.headers.get("X-WP-Total") || 0);

  await cache.setex(keyTotalCount, PUBLIC_TTL, total.toString());
  return total;
}

export async function fetchPublicPostListContent() {
  const cache = await getCacheClient();
  const cached = await cache.get(keyListContent);
  if (cached) return JSON.parse(cached);

  const url = `${process.env.WP_REST_URL}/all-posts?_fields=slug,title.rendered,excerpt.markdown,date,modified,content.markdown`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();

  await cache.setex(keyListContent, PUBLIC_TTL, JSON.stringify(posts));
  return posts;
}

export async function fetchPublicPostBySlug(slug: string) {
  const cache = await getCacheClient();
  const key = keyPostSlug(slug);
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${process.env.WP_REST_URL}/all-posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,title.rendered,excerpt,date,modified,readingTime,wordCount,content.markdown,mastodon_status`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();
  const post = posts[0] || null;

  await cache.setex(key, post ? PUBLIC_TTL : 60, JSON.stringify(post));
  return post;
}

// ————— PREVIEW FETCHERS —————
function getAuthHeader() {
  const token = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`).toString('base64');
  return `Basic ${token}`;
}

export async function fetchPreviewPostById(id: string) {
  const url = `${process.env.WP_REST_URL}/all-posts/${id}?context=edit`;
  const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  return res.json();
}

export async function fetchPreviewPostBySlug(slug: string) {
  const url = `${process.env.WP_REST_URL}/all-posts?slug=${encodeURIComponent(slug)}&context=edit`;
  const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  const posts = await res.json();
  return posts[0] || null;
}

// ————— PREVIEW STORAGE —————
export async function storePreviewData(data: any): Promise<string> {
  const previewId = crypto.randomUUID();
  const cache = await getCacheClient();
  await cache.setex(keyPreview(previewId), PREVIEW_TTL, JSON.stringify(data));
  return previewId;
}

export async function getPreviewData(previewId: string) {
  const cache = await getCacheClient();
  const data = await cache.get(keyPreview(previewId));
  return data ? JSON.parse(data) : null;
}

// ————— CACHE INVALIDATION —————
export async function invalidatePublicCaches(slugs?: string | string[]) {
  const cache = await getCacheClient();

  // Always delete all paginated lists
  const listKeys = await cache.keys('wp:post-list*');
  if (listKeys.length > 0) await cache.del(...listKeys);

  // Delete full content list and total count
  await cache.del(keyListContent, keyTotalCount);

  // Delete individual post(s)
  if (slugs) {
    const slugArray = Array.isArray(slugs) ? slugs : [slugs];
    const keysToDelete = slugArray.map(keyPostSlug);
    if (keysToDelete.length > 0) await cache.del(...keysToDelete);
  }
}
