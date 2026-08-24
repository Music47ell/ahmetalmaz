import type { APIContext, APIRoute } from 'astro'

export const handle =
	(fn: (context: APIContext) => Promise<unknown>): APIRoute =>
	async (context) => {
		try {
			return Response.json(await fn(context))
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			return Response.json({ error: errorMessage }, { status: 500 })
		}
	}
