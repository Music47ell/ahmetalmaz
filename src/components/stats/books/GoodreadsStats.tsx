import type React from 'react'
import OverviewItem from '../Overview'

type GoodreadsStatsProps = {
	stats: {
		accountAgeYears: string
		totalBooks: number
		totalPages: number
		totalWords: number
		totalDaysReading: number
		uniqueAuthors: number
	}
}

const GoodreadsStats: React.FC<GoodreadsStatsProps> = ({ stats }) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<OverviewItem label="Reading Since" value={stats.accountAgeYears} />
			<OverviewItem label="Total Books" value={stats.totalBooks} />
			<OverviewItem label="Total Pages" value={stats.totalPages} />
			<OverviewItem label="Total Words" value={stats.totalWords.toLocaleString()} />
			<OverviewItem label="Days Spent Reading" value={stats.totalDaysReading} />
			<OverviewItem label="Unique Authors" value={stats.uniqueAuthors} />
		</div>
	)
}

export default GoodreadsStats
