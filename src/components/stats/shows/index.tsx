'use client'

import { useEffect, useState } from 'react'
import TraktStats from './TraktStats'
import WatchedMovies from './MoviesWatched'
import WatchedShows from './ShowsWatched'

const MoviesShowsStats = () => {
	const [stats, setStats] = useState<{
		episodes: { watched: number; minutes: number }
		movies: { watched: number; minutes: number }
		shows: { watched: number }
	}>({
		episodes: { watched: 0, minutes: 0 },
		movies: { watched: 0, minutes: 0 },
		shows: { watched: 0 },
	})
	const [shows, setShows] = useState<
		{
			title: string
			poster: string
			url: string
		}[]
	>([])
	const [movies, setMovies] = useState<
		{
			title: string
			poster: string
			url: string
		}[]
	>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/trakt')
				if (response.ok) {
					const data = await response.json()

					setStats(data.stats)
					setShows(data.watchedShows)
					setMovies(data.watchedMovies)
				}
			} catch (error) {
				console.error('Error fetching shows:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Movies & Shows Stats</h2>
			</div>

			<TraktStats stats={stats} />
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Recent Movies I've Watched</h2>
			</div>
			<WatchedMovies movies={movies} />
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Recent TV Shows I've Watched</h2>
			</div>
			<WatchedShows shows={shows} />
		</div>
	)
}

export default MoviesShowsStats
