'use client'

import { useEffect, useState } from 'react'
import OverviewItem from '../../../components/stats/Overview'
import SlugsStats from '../../../components/stats/analytics/SlugsStats'
import CitiesStats from '../../../components/stats/analytics/CitiesStats'
import CountriesStats from '../../../components/stats/analytics/CountriesStats'
import ReferrersStats from '../../../components/stats/analytics/ReferrersStats'

const AnalyticsStats = () => {
	const [data, setData] = useState<{
		lastDay: number
		lastWeek: number
		lastMonth: number
		lastYear: number
		topTenSlugs: { slug: string; views: number }[]
		topTenCities: { city: string; views: number }[]
		topTenCountries: { country: string; views: number }[]
		topTenReferrers: { referrer: string; views: number }[]
	}>()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/turso')
				if (response.ok) {
					const data = await response.json()
					setData(data)
				}
			} catch (error) {
				console.error('Error fetching analytics data:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<section className="flex flex-col gap-y-2">
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Site Stats</h2>
			</div>

			<>
				<div className="grid gap-3 md:grid-cols-2">
					<OverviewItem label="Last Day" value={data?.lastDay ?? 0} />
					<OverviewItem label="Last Week" value={data?.lastWeek ?? 0} />
					<OverviewItem label="Last Month" value={data?.lastMonth ?? 0} />
					<OverviewItem label="Last Year" value={data?.lastYear ?? 0} />
				</div>
				<SlugsStats
					title="Top 10 Blog Posts"
					slugs={(data?.topTenSlugs ?? []).map((slug) => ({
						slug: slug.slug,
						title: slug.slug,
						total: slug.views,
					}))}
				/>
				<CitiesStats
					title="Top 10 Cities"
					cities={(data?.topTenCities ?? []).map((city) => ({
						city: city.city,
						flag: city.city,
						total: city.views,
					}))}
				/>
				<CountriesStats
					title="Top 10 Countries"
					countries={(data?.topTenCountries ?? []).map((country) => ({
						country: country.country,
						flag: country.country,
						total: country.views,
					}))}
				/>
				<ReferrersStats
					title="Top 10 Referrers"
					referrers={(data?.topTenReferrers ?? []).map((referrer) => ({
						referrer: referrer.referrer,
						total: referrer.views,
					}))}
				/>
			</>
		</section>
	)
}

export default AnalyticsStats
