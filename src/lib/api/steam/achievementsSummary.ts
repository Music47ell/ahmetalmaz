import { getSteamApiKey, getSteamUserId } from '../env'
import { withCache } from '../utils/cache'
import { STEAM_BASE, storeUrl } from './helpers'

const MAX_GAMES = 30

interface OwnedGame {
	appid: number
	name: string
	playtime_forever: number
}

interface PlayerStats {
	achievements: {
		apiname: string
		achieved: number
		unlocktime?: number
	}[]
}

export interface RarestAchievement {
	appid: number
	gameName: string
	name: string
	description: string | null
	icon: string | null
	percent: number | null
	unlockTime: string | null
	storeUrl: string
}

const getOwnedGames = async (
	key: string,
	steamId: string,
): Promise<OwnedGame[]> => {
	const endpoint = `${STEAM_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
	const res = await fetch(endpoint)

	if (!res.ok) {
		throw new Error(`Steam API error: ${res.status}`)
	}

	const data = await res.json()
	return (data.response?.games || []).filter(
		(game: OwnedGame & { has_community_visible_stats?: boolean }) =>
			game.has_community_visible_stats,
	)
}

const getPlayerStats = async (
	key: string,
	steamId: string,
	appid: number,
): Promise<PlayerStats | null> => {
	const res = await fetch(
		`${STEAM_BASE}/ISteamUserStats/GetPlayerAchievements/v0001/?key=${key}&steamid=${steamId}&appid=${appid}`,
	)

	if (!res.ok) return null

	const data = await res.json()
	const stats = data.playerstats

	if (!stats?.achievements?.length) return null
	return stats
}

const getRarest = async (
	key: string,
	gameStats: { game: OwnedGame; stats: PlayerStats | null }[],
): Promise<RarestAchievement[]> => {
	const candidates = gameStats.filter(({ stats }) =>
		stats?.achievements.some((achievement) => achievement.achieved === 1),
	)
	const games = candidates.slice(0, 20)

	const results = await Promise.all(
		games.map(async ({ game, stats }) => {
			const [globalRes, schemaRes] = await Promise.all([
				fetch(
					`${STEAM_BASE}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${game.appid}&key=${key}`,
				),
				fetch(
					`${STEAM_BASE}/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${game.appid}`,
				),
			])

			const [globalData, schemaData] = await Promise.all([
				globalRes.json(),
				schemaRes.json(),
			])

			const percentMap = new Map(
				(globalData.achievementpercentages?.achievements || []).map(
					(achievement: { name: string; percent: number }) => [
						achievement.name,
						achievement.percent,
					],
				),
			)
			const schemaMap = new Map<
				string,
				{
					name: string
					displayName: string
					description?: string
					icon?: string
				}
			>(
				(
					(schemaData.game?.availableGameStats?.achievements || []) as {
						name: string
						displayName: string
						description?: string
						icon?: string
					}[]
				).map((achievement) => [achievement.name, achievement]),
			)

			return (stats?.achievements || [])
				.filter((achievement) => achievement.achieved === 1)
				.map((achievement) => {
					const meta = schemaMap.get(achievement.apiname)
					const percent = percentMap.get(achievement.apiname)
					return {
						appid: game.appid,
						gameName: game.name,
						name: meta?.displayName || achievement.apiname,
						description: meta?.description || null,
						icon: meta?.icon || null,
						percent: percent !== undefined ? Number(percent) : null,
						unlockTime: achievement.unlocktime
							? new Date(achievement.unlocktime * 1000).toISOString()
							: null,
						storeUrl: storeUrl(game.appid),
					}
				})
		}),
	)

	return results
		.flat()
		.filter((achievement) => achievement.percent !== null)
		.sort((a, b) => {
			const aTime = a.unlockTime ? Date.parse(a.unlockTime) : 0
			const bTime = b.unlockTime ? Date.parse(b.unlockTime) : 0
			const timeDiff = bTime - aTime
			if (timeDiff !== 0) return timeDiff
			return (a.percent ?? 0) - (b.percent ?? 0)
		})
		.slice(0, 10)
}

export const getSteamAchievementsSummary = async () =>
	withCache('steam:achievements-summary', 3600, async () => {
		const key = await getSteamApiKey()
		const steamId = await getSteamUserId()

		if (!key || !steamId) {
			throw new Error(
				'STEAM_API_KEY or STEAM_USER_ID environment variables are not set',
			)
		}

		const owned = (await getOwnedGames(key, steamId))
			.sort((a, b) => b.playtime_forever - a.playtime_forever)
			.slice(0, MAX_GAMES)

		const gameStats = await Promise.all(
			owned.map(async (game) => ({
				game,
				stats: await getPlayerStats(key, steamId, game.appid),
			})),
		)

		let totalAvailable = 0
		let totalEarned = 0

		for (const { stats } of gameStats) {
			if (!stats) continue

			const earned = stats.achievements.filter(
				(achievement) => achievement.achieved === 1,
			).length
			const total = stats.achievements.length

			totalAvailable += total
			totalEarned += earned
		}

		const rarest = await getRarest(key, gameStats)

		return {
			totalAvailable,
			totalEarned,
			percent: totalAvailable
				? Math.round((totalEarned / totalAvailable) * 100)
				: 0,
			rarest,
		}
	})
