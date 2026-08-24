import { handle } from '../../../lib/api/handle'
import { getSimklWatchedMovies } from '../../../lib/api/simkl/watchedMovies'

export const GET = handle(({ url }) =>
	getSimklWatchedMovies(url.searchParams.get('date_from') ?? undefined),
)

export const prerender = false
