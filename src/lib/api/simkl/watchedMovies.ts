import { getSimklAccessToken, getSimklClientId } from '../env'

export interface SimklMovie {
	title: string
	poster: string
	url: string
	rating: number | null
	year?: number
}

type SimklItem = {
	movie?: {
		title?: string
		poster?: string
		year?: number
		ids?: { simkl?: number; slug?: string }
	}
	last_watched_at?: string
	user_rating?: number | null
}

export const getSimklWatchedMovies = async (
	dateFrom?: string,
): Promise<SimklMovie[]> => {
	const clientId = (await getSimklClientId()) || ''
	const accessToken = await getSimklAccessToken()

	const endpoint = new URL(
		'https://api.simkl.com/sync/all-items/movies/watched',
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

	const data = (await res.json()) as { movies?: SimklItem[] }

	const moviesList = data.movies || []

	const sortedMovies = moviesList
		.filter((item: SimklItem) => item?.movie)
		.sort(
			(a: SimklItem, b: SimklItem) =>
				new Date(b.last_watched_at || 0).getTime() -
				new Date(a.last_watched_at || 0).getTime(),
		)
		.slice(0, 10)

	return sortedMovies.map((item: SimklItem) => {
		const movie = item.movie || {}
		const ids = movie.ids || {}
		const posterPath = movie.poster || ''

		return {
			title: movie.title || 'Unknown',
			poster: posterPath
				? `https://wsrv.nl/?url=https://simkl.in/posters/${posterPath}_m.jpg`
				: '',
			url: `https://simkl.com/movies/${ids.simkl}/${ids.slug || ''}`,
			rating: item.user_rating || null,
			year: movie.year || null,
		}
	})
}
