import type { APIRoute } from 'astro'
import { insertPageView } from '../../lib/api/analytics'

export const prerender = false

export const POST: APIRoute = async (context) => {
	try {
		const payload = await context.request.json()
		await insertPageView(context, payload)
		return Response.json({ message: 'A Ok!' })
	} catch {
		return Response.json({ message: 'Error' }, { status: 400 })
	}
}
