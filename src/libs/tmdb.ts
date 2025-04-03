import { config } from 'dotenv'

config({ path: '.env' })

export const getTMDBData = async (id: number, type: 'movies' | 'shows') => {
	const endpoint =
		type === 'movies'
			? `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=videos`
			: `https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=videos`

	return fetch(endpoint, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
			'Content-Type': 'application/json;charset=utf-8',
		},
	})
}
