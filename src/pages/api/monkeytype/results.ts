import { handle } from '../../../lib/api/handle'
import { getMonkeyTypeResults } from '../../../lib/api/monkeytype/topResults'

export const GET = handle(({ url }) => {
	const parsedLimit = Number.parseInt(url.searchParams.get('limit') || '10', 10)
	const limit = Math.min(Number.isNaN(parsedLimit) ? 10 : parsedLimit, 100)
	return getMonkeyTypeResults(limit)
})

export const prerender = false
