import { getStats, getTopLanguages } from '../../../libs/codestats'

export async function GET() {
	const stats = await getStats()
	const topLanguages = await getTopLanguages()

	return new Response(
		JSON.stringify({
			stats,
			topLanguages,
		}),
		{
			headers: {
				'content-type': 'application/json',
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
			},
		},
	)
}
