import { getTopAlbums } from '../../.././libs/listenbrainz'

export async function GET() {
	const topAlbums = await getTopAlbums()

	return new Response(JSON.stringify(topAlbums), {
		headers: { 'content-type': 'application/json' },
	})
}
