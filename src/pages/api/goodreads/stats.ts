import { handle } from '../../../lib/api/handle'
import { getGoodreadsStats } from '../../../lib/api/goodreads/stats'

export const GET = handle(() => getGoodreadsStats())

export const prerender = false
