import { handle } from '../../../lib/api/handle'
import { getWatchedShows } from '../../../lib/api/trakt/watchedShows'

export const GET = handle(() => getWatchedShows())

export const prerender = false
