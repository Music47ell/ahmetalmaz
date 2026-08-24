export const STEAM_BASE = 'https://api.steampowered.com'

export const appImage = (appid: number, hash?: string) =>
	hash
		? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`
		: null

export const headerImage = (appid: number) =>
	`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`

export const storeUrl = (appid: number) =>
	`https://store.steampowered.com/app/${appid}`

export const minutesToHours = (mins: number) =>
	Math.round((mins / 60) * 10) / 10
