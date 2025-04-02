import { getAnalytics } from '../../../libs/turso'

export async function GET() {
	const analytics = await getAnalytics()

	return new Response(JSON.stringify(analytics), {
		headers: { 'content-type': 'application/json' },
	})
}
