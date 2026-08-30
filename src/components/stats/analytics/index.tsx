'use client'

import { useEffect, useState } from 'react'
import SlugsStats from '../../../components/stats/analytics/SlugsStats'
import CountriesStats from '../../../components/stats/analytics/CountriesStats'
import CitiesGlobe from '../../../components/stats/analytics/CitiesGlobe'
import BlogOverview from '../../../components/stats/analytics/BlogOverview'

interface AnalyticsStatsProps {
	postCount: number
	wordCount: number
}

const TURSO_TEAL = '#4FF8D2'

const AnalyticsStats = ({ postCount, wordCount }: AnalyticsStatsProps) => {
	const [data, setData] = useState<{
		loaded: boolean
		totalViews: number
		monthlyVisitors: number
		monthlySlugs: { slug: string; title: string; total: number }[]
		monthlyCountries: { flag: string; country: string; total: number }[]
	}>()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/analytics/stats', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				if (response.ok) {
					const data = await response.json()
					setData({ ...data, loaded: true })
				}
			} catch (error) {
				console.error('Error fetching analytics data:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-3 flex items-center justify-between">
				<h2 className="uppercase font-semibold tracking-wide">Site Stats</h2>

				<span
					className="text-xs tracking-wider whitespace-nowrap flex items-center gap-1"
					style={{ color: TURSO_TEAL }}
				>
					<svg
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
					>
						<title>Powered by Turso</title>
						<path
							fill={TURSO_TEAL}
							d="m23.31.803-.563-.42-1.11 1.189-.891-1.286-.512.235.704 1.798-.326.35L18.082 0l-.574.284 2.25 4.836-2.108.741h-.05l-1.143-1.359-1.144 1.36H8.687l-1.144-1.36-1.146 1.363H6.36l-2.12-.745L6.491.284 5.919 0l-2.53 2.668-.327-.349.705-1.798-.512-.236-.89 1.287L1.253.382.69.804 2.42 3.69l-.89.939.311 2.375 2.061.787L3.9 8.817H1.947v.444l.755 1.078 1.197.433v6.971l3.057 4.55L7.657 24l1.101-1.606L9.9 24l.999-1.606L12 24l1.102-1.606L14.1 24l1.141-1.606L16.343 24l.701-1.706 3.058-4.55v-6.972l1.196-.433.756-1.078v-.444h-1.952l.003-1.03 2.054-.784.311-2.375-.89-.939zm-8.93 18.718H8.033l.793-1.615.794 1.615.793-1.083.793 1.083.794-1.083.793 1.083.794-1.083.793 1.083.793-1.615.794 1.615zm3.886-7.39-3.3 1.084-.143 3.061-2.827.627-2.826-.627-.142-3.06-3.3-1.085v-1.635l4.266 1.21-.052 4.126h4.109l-.052-4.127 4.266-1.209z"
						/>
					</svg>
				</span>
			</div>

			<BlogOverview
				loaded={data?.loaded ?? false}
				totalViews={data?.totalViews}
				postCount={postCount}
				wordCount={wordCount}
			/>

			<SlugsStats
				title="Pages (Last 30 Days)"
				loaded={data !== undefined}
				slugs={(data?.monthlySlugs ?? []).map((slug) => ({
					slug: slug.slug,
					title: slug.title,
					total: slug.total,
				}))}
			/>

			<CountriesStats
				title="Countries (Last 30 Days)"
				loaded={data !== undefined}
				countries={(data?.monthlyCountries ?? []).map((country) => ({
					country: country.country,
					flag: country.flag,
					total: country.total,
				}))}
			/>

			<div className="border border-dracula-dracula px-4 py-3">
				<h2 className="text-sm mb-3">Cities (All Time)</h2>
				<div className="flex justify-center h-[458px] overflow-hidden">
					<CitiesGlobe width={458} height={458} />
				</div>
			</div>
		</div>
	)
}

export default AnalyticsStats
