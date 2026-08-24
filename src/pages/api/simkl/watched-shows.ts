import { handle } from '../../../lib/api/handle'
import { getSimklWatchedShows } from '../../../lib/api/simkl/watchedShows'

export const GET = handle(({ url }) =>
	getSimklWatchedShows(url.searchParams.get('date_from') ?? undefined),
)

export const prerender = false
