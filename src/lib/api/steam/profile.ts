import { getSteamApiKey, getSteamUserId } from '../env'
import { STEAM_BASE } from './helpers'

const daysBetween = (from: number, to: number) =>
	Math.floor((to - from) / 86400)

export interface SteamProfile {
	profileUrl: string | null
	createdAt: string | null
	accountAgeYears: number | null
}

export const getSteamProfile = async () => {
	const key = await getSteamApiKey()
	const steamId = await getSteamUserId()

	if (!key || !steamId) {
		throw new Error(
			'STEAM_API_KEY or STEAM_USER_ID environment variables are not set',
		)
	}

	const endpoint = `${STEAM_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`
	const res = await fetch(endpoint)

	if (!res.ok) {
		throw new Error(`Steam API error: ${res.status}`)
	}

	const data = await res.json()
	const player = data.response?.players?.[0] || {}

	const createdAt = player.timecreated
		? new Date(player.timecreated * 1000).toISOString()
		: null
	const accountAgeDays = player.timecreated
		? daysBetween(player.timecreated, Math.floor(Date.now() / 1000))
		: null

	return {
		profileUrl: player.profileurl || null,
		createdAt,
		accountAgeYears: accountAgeDays ? Math.floor(accountAgeDays / 365) : null,
	} as SteamProfile
}
