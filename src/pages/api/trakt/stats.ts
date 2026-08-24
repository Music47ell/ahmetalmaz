import { handle } from '../../../lib/api/handle'
import { getTraktStats } from '../../../lib/api/trakt/stats'

export const GET = handle(() => getTraktStats())

export const prerender = false
