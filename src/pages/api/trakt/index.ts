import {
	getStats,
	getWatchedShows,
	getWatchedMovies,
} from '../../../libs/trakt'

export async function GET() {
	const stats = await getStats()
	const watchedShows = await getWatchedShows()
	const watchedMovies = await getWatchedMovies()

	return new Response(JSON.stringify({ stats, watchedShows, watchedMovies }), {
		headers: {
			'content-type': 'application/json',
			'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
		},
	})
}
