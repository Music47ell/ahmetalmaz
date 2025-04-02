import type React from 'react'
import { minutesToDays } from '../../../utils/formatters'
import OverviewItem from '../Overview'

type TraktStatsProps = {
	stats: {
		episodes: { watched: number; minutes: number }
		movies: { watched: number; minutes: number }
		shows: { watched: number }
	}
}

const TraktStats: React.FC<TraktStatsProps> = ({ stats }) => {
	return (
		<div className="mb-1 grid gap-3 py-2 md:grid-cols-2">
			<OverviewItem
				label="Total Days"
				value={Math.floor(
					minutesToDays(stats.episodes?.minutes + stats.movies?.minutes),
				)}
			/>
			<OverviewItem label="Shows" value={stats.shows?.watched} />
			<OverviewItem label="Movies" value={stats.movies?.watched} />
			<OverviewItem
				label="Days spent on shows"
				value={Math.floor(minutesToDays(stats.episodes?.minutes))}
			/>
			<OverviewItem
				label="Days spent on movies"
				value={Math.floor(minutesToDays(stats.movies?.minutes))}
			/>
			<OverviewItem label="Episodes watched" value={stats.episodes?.watched} />
		</div>
	)
}

export default TraktStats
