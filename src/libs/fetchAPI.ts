import { API_BASE_URL } from 'astro:env/client'
import { BLOG_TOKEN } from 'astro:env/server'

function authHeaders(): HeadersInit {
	return BLOG_TOKEN ? { Authorization: `Bearer ${BLOG_TOKEN}` } : {}
}

export type Post = {
	frontmatter: {
		title: string
		excerpt: string
		slug: string
		draft: boolean
		category: string
		tags: string[]
		published: string
		updated: string
		toot?: string
		readingTime?: number
		wordCount?: number
		relatedPosts?: { slug: string; title: string; excerpt?: string }[]
	}
	content?: string
}

// ————— LIST / RSS / INDEX —————
function sortByPublished(posts: Post[]): Post[] {
	return posts.sort(
		(a, b) =>
			new Date(b.frontmatter.published).getTime() -
			new Date(a.frontmatter.published).getTime(),
	)
}

export async function fetchPublicPostList() {
	const res = await fetch(`${API_BASE_URL}/blog`, { headers: authHeaders() })
	if (!res.ok) throw new Error(`API: ${res.status}`)
	const posts = sortByPublished(await res.json())

	return posts
}

export async function fetchPublicPostListContent() {
	// 1. Fetch the list of posts (metadata)
	const res = await fetch(`${API_BASE_URL}/blog`, { headers: authHeaders() })
	if (!res.ok) throw new Error(`API List: ${res.status}`)
	
	const posts = sortByPublished(await res.json())

	// 2. Fetch full content for each post using the slug endpoint
	const postsWithFullContent = await Promise.all(
		posts.map(async (post) => {
			// Ensure post.slug exists
			if (!post.slug) return post 

			const detailRes = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(post.slug)}`, { 
				headers: authHeaders() 
			})
			
			if (!detailRes.ok) {
				// Decide if you want to throw or return the post without content
				throw new Error(`API Detail (${post.slug}): ${detailRes.status}`)
			}

			const contentData = await detailRes.json()

			// 3. Merge list data with full content data
			return {
				...post,
				...contentData
			}
		})
	)

	return postsWithFullContent
}

// ————— SINGLE POST —————
export async function fetchPublicPostBySlug(slug: string) {
	const res = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`, {
		headers: authHeaders(),
	})
	if (!res.ok && res.status !== 404) throw new Error(`API: ${res.status}`)
	const post: Post | null = res.ok ? await res.json() : null

	return post
}
