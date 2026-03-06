import { API_BASE_URL } from "astro:env/client";
import { BLOG_TOKEN } from 'astro:env/server';

function authHeaders(): HeadersInit {
  return BLOG_TOKEN ? { Authorization: `Bearer ${BLOG_TOKEN}` } : {};
}

export type Post = {
  frontmatter: {
    title: string;
    excerpt: string;
    slug: string;
    draft: boolean;
    category: string;
    tags: string[];
    published: string;
    updated: string;
    toot?: string;
    readingTime?: number;
    wordCount?: number;
    relatedPosts?: { slug: string; title: string; excerpt?: string }[];
  };
  content?: string;
};

// ————— LIST / RSS / INDEX —————
function sortByPublished(posts: Post[]): Post[] {
  return posts.sort(
    (a, b) => new Date(b.frontmatter.published).getTime() - new Date(a.frontmatter.published).getTime()
  );
}

export async function fetchPublicPostList() {


  const res = await fetch(`${API_BASE_URL}/blog`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API: ${res.status}`);
  const posts = sortByPublished(await res.json());

  return posts;
}

export async function fetchPublicPostListContent() {

  const res = await fetch(`${API_BASE_URL}/blog`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API: ${res.status}`);
  const posts = sortByPublished(await res.json());

  return posts;
}

// ————— SINGLE POST —————
export async function fetchPublicPostBySlug(slug: string) {

  const res = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`, { headers: authHeaders() });
  if (!res.ok && res.status !== 404) throw new Error(`API: ${res.status}`);
  const post: Post | null = res.ok ? await res.json() : null;

  return post;
}