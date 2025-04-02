import { getFullMessage } from '../../libs/curl-card'

export const config = {
	runtime: 'edge',
}

export async function GET() {
	return new Response(getFullMessage())
}
