import { getMonkeytypeApiKey } from '../env'
import { withCache } from '../utils/cache'

export interface TestResult {
	wpm: number
	accuracy: number
	consistency: number
	timestamp: number
}

export const getMonkeyTypeResults = async (
	limit: number = 10,
): Promise<TestResult[]> =>
	withCache(`monkeytype:results:${limit}`, 1800, async () => {
		const apiKey = await getMonkeytypeApiKey()

		if (!apiKey) {
			throw new Error('MONKEYTYPE_API_KEY environment variable is not set')
		}

		try {
			const resultsRes = await fetch(
				`https://api.monkeytype.com/results?limit=${limit}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `ApeKey ${apiKey}`,
					},
				},
			)

			if (!resultsRes.ok) {
				throw new Error(
					`Failed to fetch MonkeyType results: ${resultsRes.status}`,
				)
			}

			const resultsData = await resultsRes.json()
			const results = resultsData.data || []

			const testResults: TestResult[] = results.map((result: any) => ({
				wpm: Math.round(result.wpm * 100) / 100 || 0,
				accuracy: Math.round(result.acc * 100) / 100 || 0,
				consistency: Math.round(result.consistency * 100) / 100 || 0,
				timestamp: result.timestamp || 0,
			}))

			return testResults
		} catch (error) {
			console.error('Error fetching MonkeyType results:', error)
			throw error
		}
	})
