import { handle } from '../../../lib/api/handle'
import { getSteamStats } from '../../../lib/api/steam/stats'

export const GET = handle(() => getSteamStats())

export const prerender = false
