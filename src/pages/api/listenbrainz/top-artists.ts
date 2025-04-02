import { getTopArtists } from '../../.././libs/listenbrainz'

export async function GET() {
	const topArtists = await getTopArtists()

	return new Response(JSON.stringify(topArtists), {
		headers: { 'content-type': 'application/json' },
	})
}
