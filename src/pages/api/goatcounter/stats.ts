import { handle } from '../../../lib/api/handle'
import { getGoatcounterStats } from '../../../lib/api/goatcounter'

export const GET = handle(() => getGoatcounterStats())

export const prerender = false
