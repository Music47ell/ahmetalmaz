import type React from 'react'
import OverviewItem from '../Overview'

type SimklStatsProps = {
	stats: {
		totalDays: number
		episodes: { watched: number }
		movies: { watched: number; minutes: number; days: number }
		shows: { watched: number; minutes: number; days: number }
		anime: { watched: number; minutes: number; days: number }
	}
}

const SimklStats: React.FC<SimklStatsProps> = ({ stats }) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<OverviewItem label="Total Days" value={stats.totalDays} />
			<OverviewItem label="Shows" value={stats.shows.watched} />
			<OverviewItem label="Movies" value={stats.movies.watched} />
			<OverviewItem label="Anime" value={stats.anime.watched} />
			<OverviewItem label="Days spent on shows" value={stats.shows.days} />
			<OverviewItem label="Days spent on movies" value={stats.movies.days} />
			<OverviewItem label="Days spent on anime" value={stats.anime.days} />
			<OverviewItem label="Episodes watched" value={stats.episodes.watched} />
		</div>
	)
}

export default SimklStats
