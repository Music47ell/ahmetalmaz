import type React from 'react'
import OverviewItem from '../Overview'

type CodeStatsStats = {
	level: number
	total_xp: number
	new_xp: number
	previous_xp: number
}

type CodeStatsStatsProps = {
	codestatsData: CodeStatsStats
}

const CodeStatsStats: React.FC<CodeStatsStatsProps> = ({ codestatsData }) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<OverviewItem label="Level" value={codestatsData?.level || 0} />
			<OverviewItem label="Total XP" value={codestatsData?.total_xp || 0} />
			<OverviewItem label="Increased by" value={codestatsData?.new_xp || 0} />
			<OverviewItem label="From" value={codestatsData?.previous_xp || 0} />
		</div>
	)
}

export default CodeStatsStats
