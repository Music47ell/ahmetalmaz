import type React from 'react'
import { useState } from 'react'

interface Badge {
	badgeId: number
	level: number
	xp: number
	name: string | null
	description: string | null
	icon: string | null
	completionTime: string
}

interface SteamLevelData {
	level: number
	xp: number
	xpNeededToLevelUp: number
	badgeCount: number
	badges: Badge[]
}

type SteamLevelProps = {
	level: SteamLevelData
}

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

const BadgeDescription: React.FC<{ description: string }> = ({
	description,
}) => {
	const [open, setOpen] = useState(false)

	return (
		<span className="relative inline-flex items-center">
			<button
				type="button"
				aria-label="Badge description"
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				onClick={() => setOpen((prev) => !prev)}
				className="ml-2 inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-dracula-dracula text-xs font-bold text-dracula-vanHelsing hover:bg-dracula-aro-900/60"
			>
				?
			</button>
			{open && (
				<span className="absolute top-full left-0 z-10 mt-2 max-w-xs rounded-md border border-dracula-dracula bg-dracula-nosferatu px-3 py-2 text-sm text-dracula-cullen shadow-lg">
					{description}
				</span>
			)}
		</span>
	)
}

const SteamLevel: React.FC<SteamLevelProps> = ({ level }) => {
	if (!level.badges.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col border border-dracula-dracula shadow-lg">
			{level.badges.map((badge) => (
				<div
					key={`${badge.badgeId}-${badge.level}`}
					className="relative flex items-center gap-4 p-4 border-b border-dracula-dracula last:border-b-0"
				>
					{badge.icon ? (
						<img
							src={badge.icon}
							alt={badge.name ?? `Badge #${badge.badgeId}`}
							title={badge.name ?? `Badge #${badge.badgeId}`}
							width={64}
							height={64}
							loading="lazy"
							className="block shrink-0"
						/>
					) : (
						<div className="h-16 w-16 animate-pulse bg-white shrink-0" />
					)}

					<div className="flex flex-col gap-1 w-full">
						<p className="text-base font-semibold text-dracula-cullen md:text-lg">
							{badge.name ?? `Badge #${badge.badgeId}`}
							{badge.description && (
								<BadgeDescription description={badge.description} />
							)}
						</p>
						<p className="text-xs text-dracula-marcelin">
							Level {badge.level} · {badge.xp} XP · Earned{' '}
							{formatDate(badge.completionTime)}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default SteamLevel
