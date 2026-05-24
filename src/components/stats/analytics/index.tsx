'use client'

import { useEffect, useState } from 'react'
import OverviewItem from '../../../components/stats/Overview'
import ReferrersStats from '../../../components/stats/analytics/ReferrersStats'
import SlugsStats from '../../../components/stats/analytics/SlugsStats'
import CountriesStats from '../../../components/stats/analytics/CountriesStats'
import BrowsersStats from '../../../components/stats/analytics/BrowsersStats'
import OperatingSystemsStats from '../../../components/stats/analytics/OperatingSystemsStats'
import DeviceTypesStats from '../../../components/stats/analytics/DeviceTypesStats'

import { API_BASE_URL } from 'astro:env/client'

const AnalyticsStats = () => {
	const [data, setData] = useState<{
		monthlyVisitors: number
		monthlySlugs: { slug: string; title: string; total: number }[]
		monthlyCountries: { flag: string; country: string; total: number }[]
		monthlyReferrers: { referrer: string; total: number }[]
		monthlyDeviceTypes: { type: string; total: number }[]
		monthlyOperatingSystems: { os: string; total: number }[]
		monthlyBrowsers: { browser: string; total: number }[]
	}>()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/goatcounter/stats`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

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

				<span className="text-xs text-yellow-400 tracking-wider whitespace-nowrap flex items-center gap-1">
					<svg
						role="img"
						viewBox="0 0 417 429"
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
					>
						<title>Powered by GoatCounter</title>
						<path
							fill="none"
							stroke="#9a15a4"
							strokeWidth="44.5"
							d="M25.399,235.075l118.517,-135.285c0,0 -124.734,-57.004 -120.995,-58.98c182.412,-96.381 370.769,214.033 370.769,214.033l-24.839,65.501c0,0 -169.954,-0.509 -192.464,-75.727"
						/>
						<path
							fill="none"
							stroke="#9a15a4"
							strokeWidth="44.5"
							d="M179.11,406.252c-0.044,-36.273 38.389,-117.225 38.389,-117.225"
						/>
					</svg>
				</span>
			</div>

			<>
				<OverviewItem
					label="Visitors"
					value={data?.monthlyVisitors ?? 0}
				/>

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
