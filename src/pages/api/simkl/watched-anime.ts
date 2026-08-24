import { handle } from '../../../lib/api/handle'
import { getSimklWatchedAnime } from '../../../lib/api/simkl/watchedAnime'

export const GET = handle(({ url }) =>
	getSimklWatchedAnime(url.searchParams.get('date_from') ?? undefined),
)

export const prerender = false
