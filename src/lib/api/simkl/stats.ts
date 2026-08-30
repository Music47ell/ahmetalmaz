import { getSimklAccessToken, getSimklClientId, getSimklUserId } from '../env'

export const getSimklStats = async () => {
	const userId = await getSimklUserId()
	const clientId = (await getSimklClientId()) || ''
	const accessToken = await getSimklAccessToken()

	const endpoint = `https://api.simkl.com/users/${userId}/stats`
	const res = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'simkl-api-key': clientId,
			Authorization: `Bearer ${accessToken}`,
		} as HeadersInit,
	})

	if (!res.ok) {
		throw new Error(`Simkl API error: ${res.status}`)
	}

	const data = await res.json()

	const minutesToDays = (mins: number) => Math.floor(mins / 1440)

	const moviesWatched = data.movies?.completed?.count || 0
	const moviesMinutes = data.movies?.completed?.mins || 0

	const tvShowsWatched = data.tv?.completed?.count || 0
	const tvEpisodesWatched = data.tv?.completed?.watched_episodes_count || 0
	const tvMinutes = data.tv?.total_mins || 0

	const animeWatched = data.anime?.completed?.count || 0
	const animeEpisodesWatched =
		data.anime?.completed?.watched_episodes_count || 0
	const animeMinutes = data.anime?.total_mins || 0

	const totalDays = minutesToDays(data.total_mins || 0)

	return {
		totalDays,
		episodes: {
			watched: tvEpisodesWatched + animeEpisodesWatched,
		},
		movies: {
			watched: moviesWatched,
			days: minutesToDays(moviesMinutes),
		},
		shows: {
			watched: tvShowsWatched,
			days: minutesToDays(tvMinutes),
		},
		anime: {
			watched: animeWatched,
			days: minutesToDays(animeMinutes),
		},
	}
}
