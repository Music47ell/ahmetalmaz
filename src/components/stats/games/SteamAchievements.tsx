import type React from 'react'

interface RarestAchievement {
	appid: number
	gameName: string
	name: string
	description: string | null
	icon: string
	percent: number
	unlockTime: string
	storeUrl: string
}

interface SteamAchievementsData {
	totalAvailable: number
	totalEarned: number
	percent: number
	rarest: RarestAchievement[]
}

type SteamAchievementsProps = {
	achievements: SteamAchievementsData
}

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

const SteamAchievements: React.FC<SteamAchievementsProps> = ({
	achievements,
}) => {
	return (
		<div className="flex flex-col gap-y-2">
			{achievements.rarest.length > 0 && (
				<>
					<div className="flex flex-col border border-dracula-dracula shadow-lg">
						{achievements.rarest.map((achievement) => (
							<a
								key={`${achievement.appid}-${achievement.name}`}
								href={achievement.storeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="relative flex items-center gap-4 p-4 border-b border-dracula-dracula last:border-b-0 hover:bg-dracula-aro-900/40"
							>
								<img
									src={achievement.icon}
									alt={achievement.name}
									title={achievement.name}
									width={48}
									height={48}
									loading="lazy"
									className="block shrink-0"
								/>
								<div className="flex flex-col gap-1 w-full">
									<p className="text-base font-semibold text-dracula-cullen md:text-lg">
										{achievement.name}
										<span className="ml-2 text-xs font-normal text-dracula-marcelin">
											{achievement.gameName}
										</span>
									</p>
									{achievement.description && (
										<p className="text-sm text-dracula-cullen/80">
											{achievement.description}
										</p>
									)}
									<p className="text-xs text-dracula-lincoln">
										Rare: {achievement.percent}% of players · Unlocked{' '}
										{formatDate(achievement.unlockTime)}
									</p>
								</div>
							</a>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default SteamAchievements
