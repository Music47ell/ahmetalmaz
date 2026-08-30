import { getTraktClientId, getUsername } from '../env'
import { getTMDBData } from '../tmdb'

export interface Show {
	title: string
	poster: string
	url: string
	rating: number | null
	watched: Date
}

type TraktHistoryItem = {
	show: {
		ids: {
			tmdb: number
		}
	}
}

type TraktRatingItem = {
	rating: number
	show: {
		ids: {
			tmdb: number
		}
	}
}

export const getWatchedShows = async (): Promise<Show[]> => {
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
		`https://api.trakt.tv/users/${username}/history/shows?limit=1000`,
		{ headers },
	)

	const traktShows = (await historyRes.json()) as TraktHistoryItem[]

	const tmdbIds = Array.from(
		new Set(traktShows.map((s) => s.show.ids.tmdb)),
	).slice(0, 10)

	const ratingsRes = await fetch(
		`https://api.trakt.tv/users/${username}/ratings/shows`,
		{ headers },
	)

	const traktRatings = (await ratingsRes.json()) as TraktRatingItem[]

	const ratingMap = new Map<number, number>()
	for (const item of traktRatings) {
		if (item.show?.ids?.tmdb) {
			ratingMap.set(item.show.ids.tmdb, item.rating)
		}
	}

	const shows = (
		await Promise.all(
			tmdbIds.map(async (tmdbId) => {
				const tmdbRes = await getTMDBData(tmdbId, 'shows')
				const data = await tmdbRes.json()

				if (!data.poster_path || !data.name) return null

				return {
					title: data.name,
					poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
					url: `https://www.themoviedb.org/tv/${tmdbId}`,
					rating: ratingMap.get(tmdbId) ?? null,
				}
			}),
		)
	).filter(Boolean) as Show[]

	return shows
}
