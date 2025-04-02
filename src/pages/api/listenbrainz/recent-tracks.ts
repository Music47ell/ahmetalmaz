import { getRecentTracks } from '../../.././libs/listenbrainz'

export async function GET() {
	const recentTracks = await getRecentTracks()

	return new Response(JSON.stringify(recentTracks), {
		headers: { 'content-type': 'application/json' },
	})
}
