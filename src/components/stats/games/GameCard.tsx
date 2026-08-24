import type React from 'react'

export interface Game {
	appid: number
	name: string
	hours: number
	header: string | null
	storeUrl: string
}

interface GameCardProps {
	game: Game
	playtimeLabel?: string
}

const GameCard: React.FC<GameCardProps> = ({ game, playtimeLabel }) => {
	return (
		<a
			href={game.storeUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="group relative flex flex-col overflow-hidden border border-dracula-dracula bg-dracula-aro-900/40"
		>
			{game.header ? (
				<div className="relative aspect-2/1 w-full overflow-hidden">
					<img
						src={game.header}
						alt={game.name}
						title={game.name}
						loading="lazy"
						className="h-full w-full object-cover"
					/>
					{playtimeLabel && (
						<span className="absolute top-2 right-2 flex shrink-0 items-center gap-1.5 rounded-full border border-dracula-dracula bg-dracula-nosferatu/80 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-dracula-lincoln backdrop-blur-md">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-3.5 w-3.5"
							>
								<title>Playtime</title>
								<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-8.25 4-2.5v4l-4-2.5zm-5-3 4 2.5-4 2.5v-5z" />
							</svg>
							{playtimeLabel}
						</span>
					)}
				</div>
			) : (
				<div className="aspect-2/1 w-full animate-pulse bg-white" />
			)}

			<div className="p-4">
				<p className="line-clamp-2 text-base font-semibold text-dracula-cullen md:text-lg">
					{game.name}
				</p>
			</div>
		</a>
	)
}

export default GameCard
