import { getSteamApiKey, getSteamUserId } from '../env'
import { headerImage, minutesToHours, STEAM_BASE, storeUrl } from './helpers'

const minutesToDays = (mins: number) => Math.floor(mins / 1440)

export interface SteamGame {
	appid: number
	name: string
	hours: number
	header: string | null
	storeUrl: string
}

export const getSteamStats = async (limit: number = 10) => {
	const key = await getSteamApiKey()
	const steamId = await getSteamUserId()

	if (!key || !steamId) {
		throw new Error(
			'STEAM_API_KEY or STEAM_USER_ID environment variables are not set',
		)
	}

	const endpoint = `${STEAM_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
	const res = await fetch(endpoint)

	if (!res.ok) {
		throw new Error(`Steam API error: ${res.status}`)
	}

	const data = await res.json()
	const response = data.response || {}

	const rawGames: {
		appid: number
		name: string
		playtime_forever: number
	}[] = response.games || []
	const totalPlaytime = rawGames.reduce(
		(sum, game) => sum + (game.playtime_forever || 0),
		0,
	)

	const mostPlayed: SteamGame[] = [...rawGames]
		.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
		.slice(0, limit)
		.map((game) => ({
			appid: game.appid,
			name: game.name,
			hours: minutesToHours(game.playtime_forever || 0),
			header: headerImage(game.appid),
			storeUrl: storeUrl(game.appid),
		}))

	return {
		totalGames: response.game_count || rawGames.length,
		totalPlaytime,
		totalHours: minutesToHours(totalPlaytime),
		totalDays: minutesToDays(totalPlaytime),
		mostPlayed,
	}
}
