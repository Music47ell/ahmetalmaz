import type { APIContext } from 'astro'
import { getBlogViewsBySlug } from '../../../../libs/turso'

export async function GET({ params }: APIContext) {
	const slug = params.slug
	if (!slug) return new Response(null, { status: 404 })

	const count = await getBlogViewsBySlug(slug)

	return new Response(JSON.stringify({ count }), {
		headers: { 'Content-Type': 'application/json' },
	})
}
