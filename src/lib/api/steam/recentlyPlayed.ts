import { getSteamApiKey, getSteamUserId } from '../env'
import { withCache } from '../utils/cache'
import { headerImage, minutesToHours, STEAM_BASE, storeUrl } from './helpers'

export interface RecentlyPlayedGame {
	appid: number
	name: string
	hours2weeks: number
	header: string | null
	storeUrl: string
}

export const getRecentlyPlayed = async (count: number = 10) =>
	withCache(`steam:recently-played:${count}`, 1800, async () => {
		const key = await getSteamApiKey()
		const steamId = await getSteamUserId()

		if (!key || !steamId) {
			throw new Error(
				'STEAM_API_KEY or STEAM_USER_ID environment variables are not set',
			)
		}

		const endpoint = `${STEAM_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamId}&count=${count}`
		const res = await fetch(endpoint)

		if (!res.ok) {
			throw new Error(`Steam API error: ${res.status}`)
		}

		const data = await res.json()
		const response = data.response || {}

		const games: RecentlyPlayedGame[] = (response.games || []).map(
			(game: { appid: number; name: string; playtime_2weeks: number }) => ({
				appid: game.appid,
				name: game.name,
				hours2weeks: minutesToHours(game.playtime_2weeks || 0),
				header: headerImage(game.appid),
				storeUrl: storeUrl(game.appid),
			}),
		)

		return { games }
	})
