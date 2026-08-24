import { handle } from '../../../lib/api/handle'
import { getCodeStatsStats } from '../../../lib/api/codestats/stats'

export const GET = handle(() => getCodeStatsStats())

export const prerender = false
