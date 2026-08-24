import type React from 'react'
import OverviewItem from '../Overview'

type SteamStatsData = {
	totalGames: number
	totalPlaytime: number
	totalHours: number
	totalDays: number
}

type SteamLevelData = {
	level: number
	badgeCount: number
	xp: number
	xpNeededToLevelUp: number
}

type SteamAchievementsData = {
	totalEarned: number
	totalAvailable: number
	percent: number
}

type SteamStatsProps = {
	stats: SteamStatsData
	level: SteamLevelData
	achievements: SteamAchievementsData
}

const SteamStats: React.FC<SteamStatsProps> = ({
	stats,
	level,
	achievements,
}) => {
	return (
		<div className="flex flex-col gap-y-2">
			<div className="grid gap-3 md:grid-cols-2">
				<OverviewItem label="Total Games" value={stats.totalGames} />
				<OverviewItem
					label="Total Playtime (minutes)"
					value={stats.totalPlaytime}
				/>
				<OverviewItem label="Total Hours" value={stats.totalHours} />
				<OverviewItem label="Total Days" value={stats.totalDays} />
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				<OverviewItem label="Steam Level" value={level.level} />
				<OverviewItem label="Badges" value={level.badgeCount} />
				<OverviewItem label="Total XP" value={level.xp} />
				<OverviewItem label="XP to Level Up" value={level.xpNeededToLevelUp} />
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				<OverviewItem
					label="Achievements Unlocked"
					value={achievements.totalEarned}
				/>
				<OverviewItem
					label="Total Available"
					value={achievements.totalAvailable}
				/>
				<OverviewItem label="Completion" value={achievements.percent} />
			</div>
		</div>
	)
}

export default SteamStats
