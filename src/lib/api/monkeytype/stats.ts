import { getMonkeytypeApiKey, getMonkeytypeUsername } from '../env'

export interface MonkeyTypeStats {
	bestRecord: {
		wpm: number
		accuracy: number
		rawWpm: number
		consistency: number
		timestamp: number
	}
	totalTests: number
	totalTimeTyping: number
	totalWords: number
	recentResults: {
		wpm: number
		accuracy: number
		consistency: number
		timestamp: number
	}[]
}

export const getMonkeyTypeStats = async (): Promise<MonkeyTypeStats> => {
	const apiKey = await getMonkeytypeApiKey()
	const username = await getMonkeytypeUsername()

	if (!apiKey) {
		throw new Error('MONKEYTYPE_API_KEY environment variable is not set')
	}

	if (!username) {
		throw new Error('MONKEYTYPE_USERNAME environment variable is not set')
	}

	try {
		const profileRes = await fetch(
			`https://api.monkeytype.com/users/${username}/profile?isUid=false`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `ApeKey ${apiKey}`,
				},
			},
		)

		if (!profileRes.ok) {
			if (profileRes.status === 479) {
				console.warn('MonkeyType profile request rate limited')
				return {
					bestRecord: {
						wpm: 0,
						accuracy: 0,
						rawWpm: 0,
						consistency: 0,
						timestamp: 0,
					},
					totalTests: 0,
					totalTimeTyping: 0,
					totalWords: 0,
					recentResults: [],
				}
			}
			throw new Error(
				`Failed to fetch MonkeyType profile: ${profileRes.status}`,
			)
		}

		const profileData = await profileRes.json()
		const user = profileData.data

		const typingStats = user.typingStats || {}

		let bestRecord = {
			wpm: 0,
			accuracy: 0,
			rawWpm: 0,
			consistency: 0,
			timestamp: 0,
		}

		const allPbs: any[] = []

		if (user.personalBests?.time) {
			Object.values(user.personalBests.time).forEach((timeMode: any) => {
				if (Array.isArray(timeMode)) {
					allPbs.push(...timeMode)
				}
			})
		}

		if (user.personalBests?.words) {
			Object.values(user.personalBests.words).forEach((wordsMode: any) => {
				if (Array.isArray(wordsMode)) {
					allPbs.push(...wordsMode)
				}
			})
		}

		if (allPbs.length > 0) {
			const bestResult = allPbs.reduce((prev: any, current: any) => {
				return (current.wpm || 0) > (prev.wpm || 0) ? current : prev
			})

			bestRecord = {
				wpm: Math.round(bestResult.wpm * 100) / 100 || 0,
				accuracy: Math.round(bestResult.acc * 100) / 100 || 0,
				rawWpm: Math.round(bestResult.raw * 100) / 100 || 0,
				consistency: Math.round(bestResult.consistency * 100) / 100 || 0,
				timestamp: bestResult.timestamp || 0,
			}
		}

		let totalWords = 0
		let recentResults: {
			wpm: number
			accuracy: number
			consistency: number
			timestamp: number
		}[] = []

		const resultsRes = await fetch(
			`https://api.monkeytype.com/results?limit=1000`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `ApeKey ${apiKey}`,
				},
			},
		)

		if (resultsRes.ok) {
			const resultsData = await resultsRes.json()
			const results = resultsData.data || []

			results.forEach((result: any) => {
				const correctChars = result.charStats?.[0] || 0
				totalWords += Math.round(correctChars / 5)
			})

			recentResults = results.slice(0, 10).map((result: any) => ({
				wpm: Math.round(result.wpm * 100) / 100 || 0,
				accuracy: Math.round(result.acc * 100) / 100 || 0,
				consistency: Math.round(result.consistency * 100) / 100 || 0,
				timestamp: result.timestamp || 0,
			}))
		} else {
			console.warn(`Failed to fetch MonkeyType results: ${resultsRes.status}`)
		}

		return {
			bestRecord,
			totalTests: typingStats.completedTests || 0,
			totalTimeTyping: typingStats.timeTyping || 0,
			totalWords,
			recentResults,
		}
	} catch (error) {
		console.error('Error fetching MonkeyType stats:', error)
		throw error
	}
}
