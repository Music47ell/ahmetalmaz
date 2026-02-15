'use client'

import { useEffect, useState } from 'react'
import OverviewItem from '../../../components/stats/Overview'
import ReferrersStats from '../../../components/stats/analytics/ReferrersStats'
import SlugsStats from '../../../components/stats/analytics/SlugsStats'
import CountriesStats from '../../../components/stats/analytics/CountriesStats'
import CitiesStats from '../../../components/stats/analytics/CitiesStats'
import BrowsersStats from '../../../components/stats/analytics/BrowsersStats'
import OperatingSystemsStats from '../../../components/stats/analytics/OperatingSystemsStats'
import DeviceTypesStats from '../../../components/stats/analytics/DeviceTypesStats'

import {API_BASE_URL, INSIGHT_TOKEN} from 'astro:env/client'

const AnalyticsStats = () => {
	const [data, setData] = useState<{
		monthlyPageViewsStats: number
		monthlyVisitsStats: number
		monthlyVisitorsStats: number
		monthlyVisitDurationStats: number
		monthlyBounceRateStats: number
		monthlyEntryPagesStats: { slug: string; title: string; total: number }[]
		monthlyExitPagesStats: { slug: string; title: string; total: number }[]
		monthlyLanguageStats: { language: string; total: number }[]
		monthlySlugs: { slug: string; title: string; total: number }[]
		monthlyCities: { flag: string; city: string; total: number }[]
		monthlyCountries: { flag: string; country: string; total: number }[]
		monthlyReferrers: { referrer: string; total: number }[]
		monthlyDeviceTypes: { type: string; total: number }[]
		monthlyOperatingSystems: { os: string; total: number }[]
		monthlyBrowsers: { browser: string; total: number }[]
	}>()

	useEffect(() => {
		const fetchData = async () => {
			try {
					const response = await fetch(`${API_BASE_URL}/insight`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${INSIGHT_TOKEN}`,
			},
		});

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
			<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-3 flex items-center justify-between">
  <h2 className="uppercase font-semibold tracking-wide">
    Site Stats (Last 30 Days)
  </h2>

  <span className="text-xs text-yellow-400 tracking-wider whitespace-nowrap flex items-center">
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><title>Powered by Turso</title><path fill="#4FF8D2" d="m23.31.803-.563-.42-1.11 1.189-.891-1.286-.512.235.704 1.798-.326.35L18.082 0l-.574.284 2.25 4.836-2.108.741h-.05l-1.143-1.359-1.144 1.36H8.687l-1.144-1.36-1.146 1.363H6.36l-2.12-.745L6.491.284 5.919 0l-2.53 2.668-.327-.349.705-1.798-.512-.236-.89 1.287L1.253.382.69.804 2.42 3.69l-.89.939.311 2.375 2.061.787L3.9 8.817H1.947v.444l.755 1.078 1.197.433v6.971l3.057 4.55L7.657 24l1.101-1.606L9.9 24l.999-1.606L12 24l1.102-1.606L14.1 24l1.141-1.606L16.343 24l.701-1.706 3.058-4.55v-6.972l1.196-.433.756-1.078v-.444h-1.952l.003-1.03 2.054-.784.311-2.375-.89-.939zm-8.93 18.718H8.033l.793-1.615.794 1.615.793-1.083.793 1.083.794-1.083.793 1.083.794-1.083.793 1.083.793-1.615.794 1.615zm3.886-7.39-3.3 1.084-.143 3.061-2.827.627-2.826-.627-.142-3.06-3.3-1.085v-1.635l4.266 1.21-.052 4.126h4.109l-.052-4.127 4.266-1.209z"/></svg>
</span>
</div>

			<>
				<div className="grid gap-3 md:grid-cols-2">
					<OverviewItem label="Page Views" value={data?.monthlyPageViewsStats ?? 0} />
					<OverviewItem label="Visits" value={data?.monthlyVisitsStats ?? 0} />
					<OverviewItem label="Visitors" value={data?.monthlyVisitorsStats ?? 0} />
					<OverviewItem
					  label="Visit Duration"
					  value={
					    data?.monthlyVisitDurationStats
					      ? (() => {
					          const totalMs = data.monthlyVisitDurationStats
					          const totalSeconds = Math.floor(totalMs / 1000)
					          const minutes = Math.floor(totalSeconds / 60)
					          const seconds = totalSeconds % 60
					          return `${minutes}m ${seconds}s`
					        })()
					      : "0m 0s"
					  }
					/>
					<OverviewItem
					  label="Bounce Rate"
					  value={
					    data?.monthlyBounceRateStats !== undefined
					      ? `${data.monthlyBounceRateStats.toFixed(0)}%`
					      : "0%"
					  }
					/>
				</div>

				<SlugsStats
					title="Pages"
					slugs={(data?.monthlySlugs ?? []).map((slug) => ({
						slug: slug.slug,
						title: slug.title,
						total: slug.total,
					}))}
				/>

				<ReferrersStats
					title="Referrers"
					referrers={(data?.monthlyReferrers ?? []).map((referrer) => ({
						referrer: referrer.referrer,
						total: referrer.total,
					}))}
				/>

				<CountriesStats
					title="Countries"
					countries={(data?.monthlyCountries ?? []).map((country) => ({
						country: country.country,
						flag: country.flag,
						total: country.total,
					}))}
				/>

				<CitiesStats
					title="Cities"
					cities={(data?.monthlyCities ?? []).map((city) => ({
						city: city.city,
						flag: city.flag,
						total: city.total,
					}))}
				/>

				<BrowsersStats
					title="Browsers"
					browsers={(data?.monthlyBrowsers ?? []).map((browser) => ({
						browser: browser.browser,
						total: browser.total,
					}))}
				/>

				<OperatingSystemsStats
					title="Operating Systems"
					operatingSystems={(data?.monthlyOperatingSystems ?? []).map((os) => ({
						os: os.os,
						total: os.total,
					}))}
				/>

				<DeviceTypesStats
					title="Device Types"
					devices={(data?.monthlyDeviceTypes ?? []).map((device) => ({
						type: device.type,
						total: device.total,
					}))}
				/>
			</>
		</div>
	)
}

export default AnalyticsStats
