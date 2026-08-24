import { getGoatcounterApiKey, getGoatcounterEndpoint } from '../env'
import { withCache } from '../utils/cache'

function roundToHour(d: Date): string {
	d.setMinutes(0, 0, 0)
	return d.toISOString()
}

function getDateRange(days: number) {
	const end = roundToHour(new Date())
	const start = roundToHour(new Date(Date.now() - days * 24 * 60 * 60 * 1000))
	return { start, end }
}

async function goatget<T>(path: string): Promise<T> {
	const endpoint = (await getGoatcounterEndpoint())?.replace(/\/+$/, '')
	const token = await getGoatcounterApiKey()

	if (!endpoint || !token) {
		throw new Error(
			'GoatCounter not configured: set GOATCOUNTER_ENDPOINT and GOATCOUNTER_API_KEY',
		)
	}

	const url = new URL(`${endpoint}/api/v0${path}`)
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})

	if (!res.ok) {
		const body = await res.json().catch(() => ({}))
		throw new Error(
			`GoatCounter API error ${res.status}: ${JSON.stringify(body)}`,
		)
	}

	return res.json()
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface HitListStat {
	day: string
	hourly: number[]
	daily: number
	weekly?: number
	monthly?: number
}

interface TotalResponse {
	total: number
	total_events: number
	total_utc: number
	stats: HitListStat[]
}

interface HitList {
	path: string
	title: string
	count: number
	path_id: number
	event: boolean
}

interface HitsResponse {
	hits: HitList[]
	more: boolean
	total: number
}

interface HitStat {
	name: string
	count: number
	id: string
}

interface StatsResponse {
	stats: HitStat[]
	more: boolean
}

const sizeNames: Record<string, string> = {
	phone: 'Phone',
	tablet: 'Tablet',
	desktop: 'Desktop',
	desktophd: 'Large Desktop',
	unknown: 'Unknown',
}

const flagEmoji = (code: string) => {
	if (!code) return '\u{1F30D}'
	return [...code.toUpperCase()]
		.map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
		.join('')
}

export async function getGoatcounterStats() {
	return withCache('goatcounter:stats:30d', 300, async () => {
		const { start, end } = getDateRange(30)
		const totalParams = new URLSearchParams({ start, end }).toString()
		const listParams = new URLSearchParams({
			start,
			end,
			limit: '10',
		}).toString()

		const totalRes = await goatget<TotalResponse>(`/stats/total?${totalParams}`)
		await sleep(300)
		const slugsRes = await goatget<HitsResponse>(`/stats/hits?${listParams}`)
		await sleep(300)
		const refsRes = await goatget<StatsResponse>(`/stats/toprefs?${listParams}`)
		await sleep(300)
		const locsRes = await goatget<StatsResponse>(
			`/stats/locations?${listParams}`,
		)
		await sleep(300)
		const browsersRes = await goatget<StatsResponse>(
			`/stats/browsers?${listParams}`,
		)
		await sleep(300)
		const systemsRes = await goatget<StatsResponse>(
			`/stats/systems?${listParams}`,
		)
		await sleep(300)
		const sizesRes = await goatget<StatsResponse>(`/stats/sizes?${listParams}`)
		await sleep(300)
		const langsRes = await goatget<StatsResponse>(
			`/stats/languages?${listParams}`,
		)

		const total = totalRes.total

		return {
			monthlyVisitors: total,
			monthlyLanguageStats: langsRes.stats.map((s) => ({
				language: s.name,
				total: s.count,
			})),
			monthlyCountries: locsRes.stats.map((s) => ({
				flag: flagEmoji(s.id),
				country: s.name,
				total: s.count,
			})),
			monthlyReferrers: refsRes.stats.map((s) => ({
				referrer: s.name || 'Direct',
				total: s.count,
			})),
			monthlySlugs: slugsRes.hits.map((h) => ({
				slug: h.path,
				title: h.title,
				total: h.count,
			})),
			monthlyBrowsers: browsersRes.stats.map((s) => ({
				browser: s.name,
				total: s.count,
			})),
			monthlyOperatingSystems: systemsRes.stats.map((s) => ({
				os: s.name,
				total: s.count,
			})),
			monthlyDeviceTypes: sizesRes.stats.map((s) => ({
				type: sizeNames[s.id] || s.name || 'Unknown',
				total: s.count,
			})),
		}
	})
}

export async function getGoatcounterSlugStats(slug: string) {
	return withCache(`goatcounter:slug:${slug}:30d`, 300, async () => {
		const { start, end } = getDateRange(30)
		const q = new URLSearchParams({
			start,
			end,
			path_by_name: 'true',
			limit: '1',
		})
		q.append('include_paths', slug)

		const res = await goatget<HitsResponse>(`/stats/hits?${q.toString()}`)
		const hit = res.hits[0]

		return {
			path: hit?.path ?? slug,
			title: hit?.title ?? null,
			count: hit?.count ?? 0,
			total: res.total,
		}
	})
}
