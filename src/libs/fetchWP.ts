// src/libs/fetchWP.ts
import { getCacheClient } from './cache';

// ————— PUBLIC (Cached) —————
const PUBLIC_TTL = process.env.DEV ? 30 : 7200; // shorter in dev

export async function fetchPublicPostList() {
  const cache = await getCacheClient();
  const key = 'wp:post-list';
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${process.env.WP_REST_URL}/posts?orderby=date&order=desc&_fields=slug,title.rendered,id`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();
  await cache.setex(key, PUBLIC_TTL, JSON.stringify(posts));
  return posts;
}

export async function fetchPublicPostBySlug(slug: string) {
  const cache = await getCacheClient();
  const key = `wp:post:slug:${slug}`;
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const url = `${process.env.WP_REST_URL}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,title.rendered,excerpt.rendered,content.rendered,date,modified,readingTime,wordCount`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API: ${res.status}`);
  const posts = await res.json();
  const post = posts[0] || null;
  await cache.setex(key, post ? PUBLIC_TTL : 60, JSON.stringify(post));
  return post;
}

// ————— PREVIEW (No Cache) —————
function getAuthHeader() {
  const token = Buffer.from(
    `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
  ).toString('base64');
  return `Basic ${token}`;
}

export async function fetchPreviewPostById(id: string) {
  const url = `${process.env.WP_REST_URL}/posts/${id}?context=edit`;
  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  return res.json();
}

export async function fetchPreviewPostBySlug(slug: string) {
  const url = `${process.env.WP_REST_URL}/posts?slug=${encodeURIComponent(slug)}&context=edit`;
  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
  const posts = await res.json();
  return posts[0] || null;
}

// ————— PREVIEW STORAGE —————
export async function storePreviewData(data: any): Promise<string> {
  const previewId = crypto.randomUUID();
  const cache = await getCacheClient();
  await cache.setex(`preview:${previewId}`, 3600, JSON.stringify(data)); // 1h
  return previewId;
}

export async function getPreviewData(previewId: string) {
  const cache = await getCacheClient();
  const data = await cache.get(`preview:${previewId}`);
  return data ? JSON.parse(data) : null;
}

// ————— INVALIDATION —————
export async function invalidatePublicCaches(slug?: string) {
  const cache = await getCacheClient();
  const keys = ['wp:post-list'];
  if (slug) keys.push(`wp:post:slug:${slug}`);
  await cache.del(...keys);
}