import {
	getListenBrainzStats,
	getRecentTracks,
	getTopAlbums,
	getTopArtists,
	getTopTracks,
} from '../../.././libs/listenbrainz'

export async function GET() {
	const stats = await getListenBrainzStats()
	const recentTracks = await getRecentTracks()
	const topTracks = await getTopTracks()
	const topAlbums = await getTopAlbums()
	const topArtists = await getTopArtists()

	return new Response(
		JSON.stringify({
			stats,
			recentTracks,
			topTracks,
			topAlbums,
			topArtists,
		}),
		{
			headers: {
				'content-type': 'application/json',
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
			},
		},
	)
}
