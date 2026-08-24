import type { Languages } from '../types'
import { getUsername } from '../env'
import { withCache } from '../utils/cache'
import { get_level, get_level_progress } from '../utils/helpers'

const GITHUB_COLORS_URL =
	'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json'

let languageColorsCache: Record<string, { color: string }> | null = null

async function getLanguageColors(): Promise<Record<string, { color: string }>> {
	if (languageColorsCache) return languageColorsCache

	const response = await fetch(GITHUB_COLORS_URL)
	const data = await response.json()
	languageColorsCache = data
	return data
}

export const getTopLanguages = async () =>
	withCache('codestats:top-languages', 3600, async () => {
		const username = await getUsername()

		const response = await fetch(`https://codestats.net/api/users/${username}`)
		const data = (await response.json()) as Languages

		const githubColors = await getLanguageColors()

		const languages: {
			name: string
			xps: number
			level: number
			percent: number
			color: string
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
				color:
					githubColors.JavaScript?.color ||
					githubColors.TypeScript?.color ||
					'#ffffff',
			})
		}

		for (const language in data.languages) {
			const langData = data.languages[language]
			if (!langData || langData.xps <= 0) continue

			if (language === 'JavaScript (JSX)' || language === 'TypeScript (JSX)')
				continue

			const baseName = language.replace(/\s*\(.*\)/, '')
			const color =
				githubColors[language]?.color ||
				githubColors[baseName]?.color ||
				'#ffffff'

			languages.push({
				name: language,
				xps: langData.xps,
				level: get_level(langData.xps),
				percent: get_level_progress(langData.xps),
				color,
			})
		}

		return languages.sort((a, b) => b.xps - a.xps).slice(0, 10)
	})
