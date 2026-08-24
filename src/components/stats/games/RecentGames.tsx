import type React from 'react'
import GameCard, { type Game } from './GameCard'

interface RecentGame extends Omit<Game, 'hours'> {
	hours2weeks: number
}

interface RecentGamesProps {
	games: RecentGame[]
}

const RecentGames: React.FC<RecentGamesProps> = ({ games }) => {
	if (!games.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="grid gap-3 py-2 md:grid-cols-2">
			{games.map((game) => (
				<GameCard
					key={`${game.appid}-${game.name}`}
					game={{ ...game, hours: game.hours2weeks }}
					playtimeLabel={`${game.hours2weeks} hrs / 2wks`}
				/>
			))}
		</div>
	)
}

export default RecentGames
