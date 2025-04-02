import { getTopTracks } from '../../.././libs/listenbrainz'

export async function GET() {
	const topTracks = await getTopTracks()

	return new Response(JSON.stringify(topTracks), {
		headers: { 'content-type': 'application/json' },
	})
}
