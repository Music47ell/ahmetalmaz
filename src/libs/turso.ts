import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'
import { sql, eq } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const connection = () => {
	return createClient({
		url: import.meta.env.DATABASE_URL || '',
		authToken: import.meta.env.DATABASE_AUTH_TOKEN || '',
	})
}

export const db = drizzle(connection())

const analyticsTable = sqliteTable('analytics', {
	id: integer('id').primaryKey(),
	date: text('date').notNull(),
	title: text('title').notNull(),
	slug: text('slug').notNull(),
	referrer: text('referrer').notNull(),
	flag: text('flag').notNull(),
	country: text('country').notNull(),
	city: text('city').notNull(),
	latitude: text('latitude').notNull(),
	longitude: text('longitude').notNull(),
})

const getBlogViews = async () => {
	const db = drizzle(connection())
	const result = await db.select().from(analyticsTable).all()
	if (result.length === 0) {
		return 0
	}
	return result.length
}

const getBlogViewsBySlug = async (slug: string) => {
	const db = drizzle(connection())
	const result = await db
		.select()
		.from(analyticsTable)
		.where(eq(analyticsTable.slug, decodeURI(`/${slug}`)))
		.all()
	if (result.length === 0) {
		return 0
	}
	return result.length
}

const getAnalytics = async () => {
	const db = drizzle(connection())
	const countries = async () => {
		const topTenCountriesStatement = sql`select flag, country, count(country) as total from analytics group by flag, country order by total desc limit 10`
		const topTenCountriesRes = await db.all(topTenCountriesStatement)
		const topTenCountries2 = (
			topTenCountriesRes as {
				flag: string | null
				country: string | null
				total: number
			}[]
		).map((item) => ({
			flag: item.flag || '🌍',
			country: item.country || 'Unknown',
			total: item.total || 0,
		}))
		return topTenCountries2
	}
	const cities = async () => {
		const topTenCitiesStatement = sql`select flag, city, count(city) as total from analytics group by flag, city order by total desc limit 10`
		const topTenCitiesRes = await db.all(topTenCitiesStatement)
		const topTenCities2 = (
			topTenCitiesRes as {
				flag: string | null
				city: string | null
				total: number
			}[]
		).map((item) => ({
			flag: item.flag || '🌍',
			city: item.city || 'Unknown',
			total: item.total || 0,
		}))
		return topTenCities2
	}
	const referrers = async () => {
		const topTenReferrersStatement = sql`select referrer, count(referrer) as total from analytics where referrer not like '%.ahmetalmaz.com%' group by referrer order by count(referrer) desc limit 10`
		const topTenReferrersRes = await db.all(topTenReferrersStatement)
		const topTenReferrers2 = (
			topTenReferrersRes as { referrer: string | null; total: number }[]
		).map((item) => ({
			referrer: item.referrer || 'Unknown',
			total: item.total,
		}))
		return topTenReferrers2
	}
	const slugs = async () => {
		const topTenSlugsStatement = sql`select slug, title, count(slug) as total from analytics where title not like '%ahmetalmaz%' group by slug order by total desc limit 10`
		const topTenSlugsRes = await db.all(topTenSlugsStatement)
		const topTenSlugs2 = (
			topTenSlugsRes as {
				slug: string | null
				title: string | null
				total: number
			}[]
		).map((item) => ({
			slug: item.slug || 'Unknown',
			title: item.title || 'Unknown',
			total: item.total,
		}))
		return topTenSlugs2
	}
	const geoLocations = async () => {
		const topTenGeoLocationsStatement = sql`select country, latitude, longitude, count(latitude) as total from analytics where date > date('now', '-30 days') group by latitude, longitude order by total desc limit 10`
		const topTenGeoLocationsRes = await db.all(topTenGeoLocationsStatement)
		const topTenGeoLocations2 = (
			topTenGeoLocationsRes as {
				country: string | null
				latitude: string | null
				longitude: string | null
				total: number
			}[]
		).map((item) => ({
			country: item.country || 'Unknown',
			latitude: item.latitude || '0',
			longitude: item.longitude || '0',
			total: item.total,
		}))
		return topTenGeoLocations2
	}
	const dates = async () => {
		const topTenDatesStatement = sql`select date, count(date) as total from analytics where date > date('now', '-30 days') group by date order by total desc limit 10`
		const topTenDatesRes = await db.all(topTenDatesStatement)
		const topTenDates2 = (
			topTenDatesRes as { date: string | null; total: number }[]
		).map((item) => ({
			date: item.date || 'Unknown',
			total: item.total,
		}))
		return topTenDates2
	}
	const lastDayStats = async () => {
		const lastDayStatement = sql`select count(date) as total from analytics where date > date('now', '-1 days')`
		const lastDayRes = (await db.all(lastDayStatement)) as { total: number }[]

		// Assuming lastDayRes is an array with one element containing the total count
		const totalCount = lastDayRes[0]?.total || 0

		return totalCount
	}
	const lastWeekStats = async () => {
		const lastWeekStatement = sql`select count(date) as total from analytics where date > date('now', '-7 days')`
		const lastWeekRes = (await db.all(lastWeekStatement)) as { total: number }[]
		const totalCount = lastWeekRes[0]?.total || 0
		return totalCount
	}

	const lastMonthStats = async () => {
		const lastMonthStatement = sql`select count(date) as total from analytics where date > date('now', '-30 days')`
		const lastMonthRes = (await db.all(lastMonthStatement)) as {
			total: number
		}[]
		const totalCount = lastMonthRes[0]?.total || 0
		return totalCount
	}

	const lastYearStats = async () => {
		const lastYearStatement = sql`select count(date) as total from analytics where date > date('now', '-365 days')`
		const lastYearRes = (await db.all(lastYearStatement)) as { total: number }[]
		const totalCount = lastYearRes[0]?.total || 0
		return totalCount
	}

	const lastDay = await lastDayStats()
	const lastWeek = await lastWeekStats()
	const lastMonth = await lastMonthStats()
	const lastYear = await lastYearStats()
	const topTenCountries = await countries()
	const topTenCities = await cities()
	const topTenReferrers = await referrers()
	const topTenSlugs = await slugs()
	const topTenGeoLocations = await geoLocations()
	const topTenDates = await dates()
	return {
		lastDay,
		lastWeek,
		lastMonth,
		lastYear,
		topTenCountries,
		topTenCities,
		topTenReferrers,
		topTenSlugs,
		topTenGeoLocations,
		topTenDates,
	}
}

const updateAnalytics = async (data: {
	title: string
	slug: string
	referrer: string
	country: string
	city: string
	latitude: string
	longitude: string
	flag: string
}) => {
	const db = drizzle(connection())
	const date = new Date().toISOString()
	const title = data.title
	const slug = data.slug
	const referrer = data.referrer
	const country = data.country
	const city = data.city
	const latitude = data.latitude
	const longitude = data.longitude
	const flag = data.flag
	await db.insert(analyticsTable).values({
		date,
		title,
		slug,
		referrer,
		flag,
		country,
		city,
		latitude,
		longitude,
	})
}

export { getBlogViews, getBlogViewsBySlug, getAnalytics, updateAnalytics }
