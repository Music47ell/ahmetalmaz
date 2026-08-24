import { handle } from '../../../lib/api/handle'
import { getRecentlyPlayed } from '../../../lib/api/steam/recentlyPlayed'

export const GET = handle(() => getRecentlyPlayed())

export const prerender = false
