import { getPost } from '../../../libs/github'

export async function GET() {
	const stats = await getPost()

	return new Response(JSON.stringify(stats), {
		headers: { 'content-type': 'application/json' },
	})
}
