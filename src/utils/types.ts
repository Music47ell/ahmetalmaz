export type Song = {
	songUrl: string
	artist: string
	title: string
	album?: string
	albumImage: string
}

export type Podcast = {
	podcastUrl: string
	title: string
	show: string
	podcastImage: string
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
	languages: { [key: string]: Language } // Use an index signature to allow string keys
}

export type Language = {
	ranking: number
	name: string
	xps: number
}
