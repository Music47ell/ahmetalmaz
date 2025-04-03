import type { APIContext } from 'astro'
import { updateAnalytics } from '../../../libs/turso'
import { getFlagEmoji } from '../../../utils/emoji-flag'

export const config = {
	runtime: 'edge',
}

export async function GET() {
	return new Response('GET method not supported for this endpoint', {
		status: 405,
	})
}

export async function POST({ params, request }: APIContext) {
	const body = await request.json()
	const { title, slug, referrer } = body
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { country, city, latitude, longitude } = (request as any).cf || {}
	try {
		if (
			!title ||
			!slug ||
			!referrer ||
			!country ||
			!city ||
			!latitude ||
			!longitude
		) {
			return new Response('Missing data', { status: 400 })
		}
		const data = {
			title,
			slug,
			referrer,
			country,
			city,
			latitude,
			longitude,
			flag: getFlagEmoji(country),
		}
		await updateAnalytics(data)
		return new Response(
			JSON.stringify({
				message: 'A Ok!',
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			},
		)
	} catch (error) {
		return new Response('Something went wrong', { status: 500 })
	}
}
