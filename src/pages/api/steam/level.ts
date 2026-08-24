import { handle } from '../../../lib/api/handle'
import { getSteamLevel } from '../../../lib/api/steam/level'

export const GET = handle(() => getSteamLevel())

export const prerender = false
