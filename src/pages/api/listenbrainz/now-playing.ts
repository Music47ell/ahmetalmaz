import { getNowPlaying } from '../../.././libs/listenbrainz'

export async function GET() {
	const nowPlaying = await getNowPlaying()

	return new Response(JSON.stringify(nowPlaying), {
		headers: { 'content-type': 'application/json' },
	})
}
