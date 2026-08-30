export interface TrackInfo {
	artist: string
	title: string
	mbid: string | null
	release_mbid: string | null
	image: string
	preview: string | null
	love?: boolean
	lastfmPlaycount?: number
	caa_id?: number | null
	caa_release_mbid?: string | null
}

export type CodeStats = {
	total_xp: number
	previous_xp: number
	new_xp: number
	level: number
	user: string
	url: string
}

export type Languages = {
	languages: { [key: string]: Language }
}

export type Language = {
	new_xps: number
	xps: number
}
