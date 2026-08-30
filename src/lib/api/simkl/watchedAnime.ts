import { getSimklAccessToken, getSimklClientId } from '../env'

export interface SimklAnime {
	title: string
	poster: string
	url: string
	rating: number | null
	year?: number
}

type SimklItem = {
	anime?: {
		title?: string
		poster?: string
		year?: number
		ids?: { simkl?: number; slug?: string }
	}
	show?: {
		title?: string
		poster?: string
		year?: number
		ids?: { simkl?: number; slug?: string }
	}
	last_watched_at?: string
	user_rating?: number | null
}

export const getSimklWatchedAnime = async (
	dateFrom?: string,
): Promise<SimklAnime[]> => {
	const clientId = (await getSimklClientId()) || ''
	const accessToken = await getSimklAccessToken()

	const endpoint = new URL(
		'https://api.simkl.com/sync/all-items/anime/watched',
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

	const data = (await res.json()) as { anime?: SimklItem[] }

	const animeList = data.anime || []

	const sortedAnime = animeList
		.filter((item: SimklItem) => item && (item.anime || item.show))
		.sort(
			(a: SimklItem, b: SimklItem) =>
				new Date(b.last_watched_at || 0).getTime() -
				new Date(a.last_watched_at || 0).getTime(),
		)
		.slice(0, 10)

	return sortedAnime.map((item: SimklItem) => {
		const anime = item.anime || item.show || {}
		const ids = anime.ids || {}
		const posterPath = anime.poster || ''

		return {
			title: anime.title || 'Unknown',
			poster: posterPath
				? `https://wsrv.nl/?url=https://simkl.in/posters/${posterPath}_m.jpg`
				: '',
			url: `https://simkl.com/anime/${ids.simkl}/${ids.slug || ''}`,
			rating: item.user_rating || null,
			year: anime.year || null,
		}
	})
}
