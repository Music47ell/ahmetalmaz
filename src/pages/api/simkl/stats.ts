import { handle } from '../../../lib/api/handle'
import { getSimklStats } from '../../../lib/api/simkl/stats'

export const GET = handle(() => getSimklStats())

export const prerender = false
