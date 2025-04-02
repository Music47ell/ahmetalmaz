import { get_level, get_level_progress } from '../utils/level-calc'
import type { CodeStats, Languages } from '../utils//types'

const API_ENDPOINT = 'https://codestats.net/api/users'
const USERNAME = process.env.USERNAME

export const getStats = async () => {
	const response = await fetch(`${API_ENDPOINT}/${USERNAME}`)

	const data = (await response.json()) as CodeStats

	data.user = USERNAME
	data.previous_xp = data?.total_xp - data?.new_xp
	data.level = Math.floor(0.025 * Math.sqrt(data?.total_xp - data?.new_xp))

	const stats = {
		user: data.user,
		level: data.level,
		total_xp: data.total_xp,
		previous_xp: data.total_xp - data.new_xp,
		new_xp: data.new_xp,
	}

	return stats
}

export const getTopLanguages = async () => {
	const response = await fetch(`${API_ENDPOINT}/${USERNAME}`)
	const data = (await response.json()) as Languages

	const languages: {
		name: string
		xps: number
		level: number
		percent: number
	}[] = []

	const jsXps = data.languages['JavaScript (JSX)']?.xps || 0
	const tsXps = data.languages['TypeScript (JSX)']?.xps || 0
	const combinedXps = jsXps + tsXps

	if (combinedXps > 0) {
		languages.push({
			name: 'React',
			xps: combinedXps,
			level: get_level(combinedXps),
			percent: get_level_progress(combinedXps),
		})
	}

	for (const language in data.languages) {
		const langData = data.languages[language]
		if (langData && langData.xps > 0) {
			languages.push({
				name: language,
				xps: langData.xps,
				level: get_level(langData.xps),
				percent: get_level_progress(langData.xps),
			})
		}
	}

	return languages.sort((a, b) => b.xps - a.xps).slice(0, 10)
}
