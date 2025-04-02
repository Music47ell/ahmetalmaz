import { getTMDBData } from './tmdb'

const USERNAME = import.meta.env.USERNAME
const TRAKT_CLIENT_ID = import.meta.env.TRAKT_CLIENT_ID

export const getNowWatching = async () => {
	const WATCHING_ENDPOINT = `https://api.trakt.tv/users/${USERNAME}/watching`

	const response = await fetch(WATCHING_ENDPOINT, {
		headers: {
			'content-type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': TRAKT_CLIENT_ID,
		},
	})
	if (response.status === 204) {
		return {
			isPlaying: false,
		}
	}

	try {
		const watching = await response.json()

		return {
			status: response.status,
			data: watching,
		}
	} catch (error) {
		return {
			status: response.status,
		}
	}
}

export const getStats = async () => {
	const STATS_ENDPOINT = `https://api.trakt.tv/users/${USERNAME}/stats`

	const response = await fetch(STATS_ENDPOINT, {
		headers: {
			'content-type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': TRAKT_CLIENT_ID,
		},
	})

	const stats = (await response.json()) as {
		movies: number
		shows: number
		episodes: number
		people: number
		networks: number
	}

	return stats
}

interface Movie {
	title: string
	poster: string
	url: string
}

export const getWatchedMovies = async (): Promise<Movie[]> => {
	const WATCHED_MOVIES_ENDPOINT = `https://api.trakt.tv/users/${USERNAME}/history/movies?page=1&limit=20`

	const response = await fetch(WATCHED_MOVIES_ENDPOINT, {
		headers: {
			'content-type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': TRAKT_CLIENT_ID,
		},
	})

	interface TraktMovie {
		movie: {
			ids: {
				tmdb: number
			}
		}
	}

	const stats = (await response.json()) as TraktMovie[]

	const ids = stats
		.map((movie: { movie: { ids: { tmdb: number } } }) => {
			return {
				tmdb: movie.movie.ids.tmdb,
			}
		})
		.filter(
			(movie: { tmdb: number }, index: number, self: { tmdb: number }[]) =>
				self.findIndex((s: { tmdb: number }) => s.tmdb === movie.tmdb) ===
				index,
		)
		.slice(0, 20)

	const movies = (await Promise.all(
		ids.map(async (id: { tmdb: number }) => {
			const tmdb = await getTMDBData(id.tmdb, 'movies')
			const tmdbJson = await tmdb.json()
			if (!tmdbJson.poster_path || !tmdbJson.title) {
				return null
			}
			const title: string = tmdbJson.title
			const poster = `https://image.tmdb.org/t/p/original${tmdbJson.poster_path}`
			const url = `https://www.themoviedb.org/movie/${id.tmdb}`
			return {
				title,
				poster,
				url,
			}
		}),
	).then((movies) =>
		movies.filter((movie) => movie !== null).slice(0, 10),
	)) as Movie[]

	return movies
}

interface Show {
	title: string
	poster: string
	url: string
}

export const getWatchedShows = async () => {
	const WATCHED_SHOWS_ENDPOINT = `https://api.trakt.tv/users/${USERNAME}/history/shows?limit=1000`

	const response = await fetch(WATCHED_SHOWS_ENDPOINT, {
		headers: {
			'content-type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': TRAKT_CLIENT_ID,
		},
	})

	interface TraktShow {
		show: {
			ids: {
				tmdb: number
			}
		}
	}

	const stats = (await response.json()) as TraktShow[]

	const ids = stats
		.map((show: { show: { ids: { tmdb: number } } }) => {
			return {
				tmdb: show.show.ids.tmdb,
			}
		}, [])
		.filter(
			(show: { tmdb: number }, index: number, self: { tmdb: number }[]) =>
				self.findIndex((s: { tmdb: number }) => s.tmdb === show.tmdb) === index,
		)
		.slice(0, 20)

	const shows = (await Promise.all(
		ids.map(async (id: { tmdb: number }) => {
			const tmdb = await getTMDBData(id.tmdb, 'shows')
			const tmdbJson = await tmdb.json()
			if (!tmdbJson.poster_path || !tmdbJson.name) {
				return null
			}
			const title: string = tmdbJson.name
			const poster = `https://image.tmdb.org/t/p/original${tmdbJson.poster_path}`
			const url = `https://www.themoviedb.org/tv/${id.tmdb}`
			return {
				title,
				poster,
				url,
			}
		}),
	).then((shows) =>
		shows.filter((show) => show !== null).slice(0, 10),
	)) as Show[]

	return shows
}
