'use client'

import { useState, useEffect } from 'react'
import CodeStatsStats from './CodeStatsStats'
import TopLanguages from './TopLanguages'

const CodingStats = () => {
	const [stats, setStats] = useState<{
		level: number
		total_xp: number
		new_xp: number
		previous_xp: number
	}>({
		level: 0,
		total_xp: 0,
		new_xp: 0,
		previous_xp: 0,
	})
	const [topLanguages, setTopLanguages] = useState<
		{
			name: string
			color: string
			percent: number
			xps: number
			level: number
		}[]
	>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/codestats')
				if (response.ok) {
					const data = await response.json()
					setStats(data.stats)
					setTopLanguages(data.topLanguages)
				}
			} catch (error) {
				console.error('Error fetching top languages:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<>
			<section className="flex flex-col gap-y-2">
				<div className="border border-red-500 px-4 py-2">
					<h2 className="uppercase">Coding Stats</h2>
				</div>
				<CodeStatsStats codestatsData={stats} />
			</section>
			<div className="flex flex-col space-y-4">
				<TopLanguages topLanguages={topLanguages} />
			</div>
		</>
	)
}

export default CodingStats
