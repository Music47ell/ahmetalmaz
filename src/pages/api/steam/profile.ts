import { handle } from '../../../lib/api/handle'
import { getSteamProfile } from '../../../lib/api/steam/profile'

export const GET = handle(() => getSteamProfile())

export const prerender = false
