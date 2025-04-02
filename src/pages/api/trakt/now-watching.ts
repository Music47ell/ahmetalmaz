import { getNowWatching } from '../../.././libs/trakt'

export async function GET() {
	const nowWatching = await getNowWatching()

	return new Response(JSON.stringify(nowWatching), {
		headers: { 'content-type': 'application/json' },
	})
}
