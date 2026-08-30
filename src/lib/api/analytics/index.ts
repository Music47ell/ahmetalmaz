import { getDb } from '../db'

const SITE_HOSTS = ['ahmetalmaz.com', 'www.ahmetalmaz.com']

const removeTrailingSlash = (v: string) =>
	v === '/' ? '/' : v.replace(/\/+$/, '')

export interface PageViewPayload {
	title?: string
	slug?: string
	referrer?: string
}

export async function insertPageView(
	context: APIContext,
	payload: PageViewPayload,
): Promise<void> {
	const origin = context.request.headers.get('origin')
	if (origin && !SITE_HOSTS.includes(new URL(origin).host)) {
		throw new Error('bad origin')
	}
	if (origin === undefined) {
		// sendBeacon same-origin may omit Origin; fall back to referer check
		const referer = context.request.headers.get('referer')
		if (referer) {
			try {
				const host = new URL(referer).host
				if (!SITE_HOSTS.includes(host) && !host.endsWith('.localhost')) {
					throw new Error('bad referer')
				}
			} catch (e) {
				if (e instanceof Error && e.message.startsWith('bad ')) throw e
				throw new Error('bad referer')
			}
		}
	}

	const locals = context.locals as Record<string, any>
	const cf = locals?.runtime?.cf ?? {}
	const hdr = (k: string) => context.request.headers.get(k)
	const country = cf.country ?? hdr('cf-ipcountry') ?? 'Unknown'
	const city =
		String(cf.city ?? hdr('cf-ipcity') ?? 'Unknown').replace(
			/[^a-zA-Z ]/g,
			' ',
		) || 'Unknown'
	const flag = /^[A-Z]{2}$/.test(country)
		? [...country]
				.map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
				.join('')
		: 'Unknown'
	const latitude = Number(cf.latitude ?? hdr('cf-iplatitude')) || null
	const longitude = Number(cf.longitude ?? hdr('cf-iplongitude')) || null

	const db = await getDb()
	await db.execute({
		sql: `INSERT INTO analytics (timestamp, title, slug, referrer, flag, country, city, latitude, longitude)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			Date.now(),
			String(payload.title ?? '').slice(0, 512),
			removeTrailingSlash(String(payload.slug ?? '')).slice(0, 256),
			String(payload.referrer ?? '').slice(0, 1024),
			flag,
			country.slice(0, 64),
			city.slice(0, 128),
			latitude,
			longitude,
		],
	})
}

const since30d = () => Date.now() - 30 * 24 * 60 * 60 * 1000

export async function getPageViewStats() {
	const db = await getDb()
	const since = since30d()

	const totalAllTime = await db.execute({
		sql: `SELECT COUNT(*) AS c FROM analytics WHERE slug != '' AND slug != '/'`,
	})

	const total = await db.execute({
		sql: `SELECT COUNT(*) AS c FROM analytics WHERE timestamp >= ? AND slug != '' AND slug != '/'`,
		args: [since],
	})

	const slugs = await db.execute({
		sql: `SELECT slug, MAX(title) AS title, COUNT(*) AS total FROM analytics
			WHERE timestamp >= ? AND slug != '' AND slug != '/'
			GROUP BY slug ORDER BY total DESC LIMIT 10`,
		args: [since],
	})

	const countries = await db.execute({
		sql: `SELECT country AS name, MIN(flag) AS flag, COUNT(*) AS total FROM analytics
			WHERE timestamp >= ? AND slug != '' AND slug != '/'
			GROUP BY country ORDER BY total DESC LIMIT 10`,
		args: [since],
	})

	return {
		totalViews: Number(totalAllTime.rows[0]?.c ?? 0),
		monthlyVisitors: Number(total.rows[0]?.c ?? 0),
		monthlySlugs: slugs.rows.map((r) => ({
			slug: String(r.slug),
			title: String(r.title ?? ''),
			total: Number(r.total),
		})),
		monthlyCountries: countries.rows.map((r) => ({
			flag: String(r.flag ?? '\u{1F30D}'),
			country: String(r.name),
			total: Number(r.total),
		})),
	}
}

export async function getSlugViews(slug: string) {
	const db = await getDb()
	let path: string
	try {
		path = decodeURIComponent(slug)
	} catch {
		path = slug
	}
	if (!path.startsWith('/')) {
		path = `/blog/${path}`
	}
	path = removeTrailingSlash(path)
	const res = await db.execute({
		sql: `SELECT COUNT(*) AS c FROM analytics WHERE slug = ?`,
		args: [path],
	})
	return { path, count: Number(res.rows[0]?.c ?? 0) }
}

export interface CityViews {
	city: string
	country: string
	latitude: number
	longitude: number
	total: number
}

export async function getCityViews(): Promise<CityViews[]> {
	const db = await getDb()
	const res = await db.execute({
		sql: `SELECT city, MAX(country) AS country, AVG(latitude) AS latitude,
			AVG(longitude) AS longitude, COUNT(*) AS total
			FROM analytics WHERE slug != '' AND slug != '/'
			GROUP BY city HAVING latitude IS NOT NULL ORDER BY total DESC`,
	})
	return res.rows.map((r) => ({
		city: String(r.city),
		country: String(r.country),
		latitude: Number(r.latitude),
		longitude: Number(r.longitude),
		total: Number(r.total),
	}))
}
