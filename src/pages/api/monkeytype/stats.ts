import { handle } from '../../../lib/api/handle'
import { getMonkeyTypeStats } from '../../../lib/api/monkeytype/stats'

export const GET = handle(() => getMonkeyTypeStats())

export const prerender = false
