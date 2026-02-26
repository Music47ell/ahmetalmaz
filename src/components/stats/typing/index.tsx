'use client'

import { useState, useEffect } from 'react'
import MonkeyStatsStats from './MonkeyStatsStats'
import MonkeyTypeTestResults from './MonkeyTypeTestResults'
import { API_BASE_URL } from 'astro:env/client'

interface MonkeyTypeStats {
  bestRecord: {
    wpm: number
    accuracy: number
    rawWpm: number
    consistency: number
    timestamp: number
  }
  totalTests: number
  totalTimeTyping: number // in seconds
  totalWords: number
  accountAge: number // in milliseconds
}

interface TestResult {
  wpm: number
  accuracy: number
  rawWpm: number
  consistency: number
  timestamp: number
}

const MonkeyTypeStats = () => {
	const [stats, setStats] = useState<MonkeyTypeStats>({
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
		accountAge: 0,
	})

	const [testResults, setTestResults] = useState<TestResult[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/monkeytype/stats`)

				if (res.ok) {
					const data = await res.json()
					setStats(data)
					setError(null)
				} else {
					setError('Failed to fetch MonkeyType stats')
					console.error('Failed to fetch MonkeyType stats:', res.status)
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error'
				setError(errorMessage)
				console.error('Error fetching MonkeyType stats:', error)
			}
		}

		const fetchTestResults = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/monkeytype/results?limit=10`)

				if (res.ok) {
					const data = await res.json()
					setTestResults(data)
				} else {
					console.error('Failed to fetch test results:', res.status)
				}
			} catch (error) {
				console.error('Error fetching test results:', error)
			}
		}

		fetchData()
		fetchTestResults()
	}, [])

	if (error) {
		return (
			<div className="border border-dracula-dracula px-4 py-3">
				<p className="text-red-400">Error: {error}</p>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-y-2">
				<div className="border border-dracula-dracula px-4 py-3 flex items-center justify-between">
					<h2 className="uppercase font-semibold tracking-wide">
						MonkeyType Stats
					</h2>
					  <span className="text-xs text-yellow-400 tracking-wider whitespace-nowrap flex items-center">
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><title>Monkeytype</title><path fill="#E2B714" d="M20 14.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM8.8 14.4h4.8a.8.8 0 1 1 0 1.6H8.8a.8.8 0 1 1 0-1.6ZM7.2 9.6a.8.8 0 0 1 .8.8V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 0 1 .8-.8Z M3.201 10.359A2.4 2.4 0 0 1 7.2 8.612a2.4 2.4 0 0 1 4 1.788V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6l.001-.041ZM17.6 12.8v2.4a.8.8 0 1 1-1.6 0v-2.4h-2.306c-.493 0-.894-.358-.894-.8 0-.442.401-.8.894-.8h6.212c.493 0 .894.358.894.8 0 .442-.401.8-.894.8H17.6ZM16.8 8H20a.8.8 0 1 1 0 1.6h-3.2a.8.8 0 1 1 0-1.6ZM4 14.4h1.6a.8.8 0 1 1 0 1.6H4a.8.8 0 1 1 0-1.6ZM13.2 8h.4a.8.8 0 1 1 0 1.6h-.4a.8.8 0 1 1 0-1.6Z M1.6 14.4H0V8.8c0-2.208 1.792-4 4-4h16c2.208 0 4 1.792 4 4v6.4c0 2.208-1.792 4-4 4H4c-2.208 0-4-1.792-4-4v-1.6h1.6v1.6A2.4 2.4 0 0 0 4 17.6h16a2.4 2.4 0 0 0 2.4-2.4V8.8A2.4 2.4 0 0 0 20 6.4H4a2.4 2.4 0 0 0-2.4 2.4v5.6Z"/></svg>
</span>
				</div>

				<MonkeyStatsStats stats={stats} />
			</div>

			<div className="flex flex-col gap-y-2">
				<MonkeyTypeTestResults title="Last 10 Results" results={testResults} />
			</div>
		</>
	)
}

export default MonkeyTypeStats