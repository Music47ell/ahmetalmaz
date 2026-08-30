import { getSimklAccessToken, getSimklClientId } from '../env'

export interface SimklShow {
	title: string
	poster: string
	url: string
	rating: number | null
	year?: number
}

type SimklItem = {
	show?: {
		title?: string
		poster?: string
		year?: number
		ids?: { simkl?: number; slug?: string }
	}
	last_watched_at?: string
	user_rating?: number | null
}

export const getSimklWatchedShows = async (
	dateFrom?: string,
): Promise<SimklShow[]> => {
	const clientId = (await getSimklClientId()) || ''
	const accessToken = await getSimklAccessToken()

	const endpoint = new URL(
		'https://api.simkl.com/sync/all-items/shows/watched',
	)

	if (dateFrom) {
		endpoint.searchParams.set('date_from', dateFrom)
	}

	const res = await fetch(endpoint.toString(), {
		headers: {
			'Content-Type': 'application/json',
			'simkl-api-key': clientId,
			Authorization: `Bearer ${accessToken}`,
		} as HeadersInit,
	})

	if (!res.ok) {
		throw new Error(`Simkl API error: ${res.status}`)
	}

	const data = (await res.json()) as { shows?: SimklItem[] }

	const showsList = data.shows || []

	const sortedShows = showsList
		.filter((item: SimklItem) => item?.show)
		.sort(
			(a: SimklItem, b: SimklItem) =>
				new Date(b.last_watched_at || 0).getTime() -
				new Date(a.last_watched_at || 0).getTime(),
		)
		.slice(0, 10)

	return sortedShows.map((item: SimklItem) => {
		const show = item.show || {}
		const ids = show.ids || {}
		const posterPath = show.poster || ''

		return {
			title: show.title || 'Unknown',
			poster: posterPath
				? `https://wsrv.nl/?url=https://simkl.in/posters/${posterPath}_m.jpg`
				: '',
			url: `https://simkl.com/tv/${ids.simkl}/${ids.slug || ''}`,
			rating: item.user_rating || null,
			year: show.year || null,
		}
	})
}
