import type { APIRoute } from 'astro'
import { getFullMessage } from '../../lib/api/curl-card'

export const GET: APIRoute = async () =>
	new Response(getFullMessage(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	})

export const prerender = false
