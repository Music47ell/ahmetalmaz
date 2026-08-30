import { getTraktClientId, getUsername } from '../env'
import { getTMDBData } from '../tmdb'

export interface Movie {
	title: string
	poster: string
	url: string
	rating: number | null
}

type TraktHistoryItem = {
	movie: {
		ids: {
			tmdb: number
		}
	}
}

type TraktRatingItem = {
	rating: number
	movie: {
		ids: {
			tmdb: number
		}
	}
}

export const getWatchedMovies = async (): Promise<Movie[]> => {
	const username = await getUsername()
	const clientId = await getTraktClientId()
	if (!clientId) {
		throw new Error('TRAKT_CLIENT_ID environment variable is not set')
	}

	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': clientId,
		'User-Agent':
			'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
	} as HeadersInit

	const historyRes = await fetch(
		`https://api.trakt.tv/users/${username}/history/movies?page=1&limit=10`,
		{ headers },
	)

	const traktMovies = (await historyRes.json()) as TraktHistoryItem[]

	const tmdbIds = Array.from(
		new Set(traktMovies.map((m) => m.movie.ids.tmdb)),
	)

	const ratingsRes = await fetch(
		`https://api.trakt.tv/users/${username}/ratings/movies`,
		{ headers },
	)

	const traktRatings = (await ratingsRes.json()) as TraktRatingItem[]

	const ratingMap = new Map<number, number>()
	for (const item of traktRatings) {
		if (item.movie?.ids?.tmdb) {
			ratingMap.set(item.movie.ids.tmdb, item.rating)
		}
	}

	const movies = (
		await Promise.all(
			tmdbIds.map(async (tmdbId) => {
				const tmdbRes = await getTMDBData(tmdbId, 'movies')
				const data = await tmdbRes.json()

				if (!data.poster_path || !data.title) return null

				return {
					title: data.title,
					poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
					url: `https://www.themoviedb.org/movie/${tmdbId}`,
					rating: ratingMap.get(tmdbId) ?? null,
				}
			}),
		)
	).filter(Boolean) as Movie[]

	return movies
}
