import { getSteamApiKey, getSteamUserId } from '../env'
import { withCache } from '../utils/cache'
import { STEAM_BASE } from './helpers'

export interface SteamBadge {
	badgeId: number
	level: number
	xp: number
	name: string | null
	description: string | null
	icon: string | null
	completionTime: string | null
}

const parseBadgePage = (
	html: string,
): Map<number, { name: string; icon: string | null }> => {
	const names = new Map<number, { name: string; icon: string | null }>()

	const blocks = html.split(/id="badge_badge_(\d+)"/).slice(1)

	for (let i = 0; i < blocks.length; i += 2) {
		const badgeId = Number(blocks[i])
		const chunk = blocks[i + 1] || ''

		const name = chunk.match(
			/<div class="badge_info_title">\s*([\s\S]*?)\s*<\/div>/,
		)?.[1]
		const icon = chunk.match(/data-delayed-image="(https:\/\/[^"]+)"/)?.[1]

		if (name) {
			names.set(badgeId, {
				name: name.replace(/&amp;/g, '&'),
				icon: icon ?? null,
			})
		}
	}

	return names
}

const getBadgeNames = async (steamId: string) => {
	try {
		const res = await fetch(
			`https://steamcommunity.com/profiles/${steamId}/badges?l=english`,
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
				},
			},
		)
		if (!res.ok) return new Map<number, { name: string; icon: string | null }>()
		return parseBadgePage(await res.text())
	} catch {
		return new Map<number, { name: string; icon: string | null }>()
	}
}

const getBadgeDescriptions = async (steamId: string, badgeIds: number[]) => {
	const results = await Promise.all(
		badgeIds.map(async (badgeId) => {
			try {
				const res = await fetch(
					`https://steamcommunity.com/profiles/${steamId}/badges/${badgeId}?l=english`,
					{
						headers: {
							'User-Agent':
								'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
						},
					},
				)
				if (!res.ok) return [badgeId, null] as const
				const html = await res.text()
				const description = html.match(
					/<div class="badge_description">\s*([\s\S]*?)\s*<\/div>/,
				)?.[1]
				return [badgeId, description ?? null] as const
			} catch {
				return [badgeId, null] as const
			}
		}),
	)

	return new Map(
		results.filter((result): result is [number, string] => result[1] !== null),
	)
}

export const getSteamLevel = async () =>
	withCache('steam:level', 3600, async () => {
		const key = await getSteamApiKey()
		const steamId = await getSteamUserId()

		if (!key || !steamId) {
			throw new Error(
				'STEAM_API_KEY or STEAM_USER_ID environment variables are not set',
			)
		}

		const endpoint = `${STEAM_BASE}/IPlayerService/GetBadges/v1/?key=${key}&steamid=${steamId}`
		const res = await fetch(endpoint)

		if (!res.ok) {
			throw new Error(`Steam API error: ${res.status}`)
		}

		const data = await res.json()
		const response = data.response || {}
		const rawBadges = response.badges || []

		const names = await getBadgeNames(steamId)
		const descriptions = await getBadgeDescriptions(
			steamId,
			rawBadges.map((badge: { badgeid: number }) => badge.badgeid),
		)

		const badges: SteamBadge[] = rawBadges.map(
			(badge: {
				badgeid: number
				level: number
				xp: number
				completion_time?: number
			}) => {
				const meta = names.get(badge.badgeid)
				return {
					badgeId: badge.badgeid,
					level: badge.level,
					xp: badge.xp,
					name: meta?.name || null,
					description: descriptions.get(badge.badgeid) || null,
					icon: meta?.icon || null,
					completionTime: badge.completion_time
						? new Date(badge.completion_time * 1000).toISOString()
						: null,
				}
			},
		)

		return {
			level: response.player_level || null,
			xp: response.player_xp || null,
			xpNeededToLevelUp: response.player_xp_needed_to_level_up || null,
			badgeCount: badges.length,
			badges,
		}
	})
