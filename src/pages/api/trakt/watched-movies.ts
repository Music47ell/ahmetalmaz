import { handle } from '../../../lib/api/handle'
import { getWatchedMovies } from '../../../lib/api/trakt/watchedMovies'

export const GET = handle(() => getWatchedMovies())

export const prerender = false
