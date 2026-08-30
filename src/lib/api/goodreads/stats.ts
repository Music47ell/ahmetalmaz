import { XMLParser } from 'fast-xml-parser'
import { getGoodreadsReadFeed } from '../env'

type GoodreadsItem = {
	title?: string
	user_read_at?: string
	author_name?: string
	book?: { num_pages?: string }
}

type GoodreadsFeed = {
	rss?: {
		channel?: {
			item?: GoodreadsItem | GoodreadsItem[]
		}
	}
}

const fetchFeed = async () => {
	const feedUrl = await getGoodreadsReadFeed()
	if (!feedUrl) {
		throw new Error('GOODREADS_READ_FEED environment variable is not set')
	}

	const res = await fetch(feedUrl, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		},
	})
	if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`)
	return res.text()
}

export const getGoodreadsStats = async () => {
	const xml = await fetchFeed()

	const parser = new XMLParser({
		ignoreAttributes: false,
		removeNSPrefix: true,
	})
	const json = parser.parse(xml) as GoodreadsFeed

	const channel = json.rss?.channel
	if (!channel) throw new Error('No channel found in feed')

	const rawItems = Array.isArray(channel.item) ? channel.item : [channel.item]

	const sortedItems = rawItems
		.filter((item: GoodreadsItem) => item.user_read_at)
		.sort(
			(a: GoodreadsItem, b: GoodreadsItem) =>
				new Date(a.user_read_at ?? '').getTime() -
				new Date(b.user_read_at ?? '').getTime(),
		)

	const totalBooks = sortedItems.length

	const firstReadAt = sortedItems[0]?.user_read_at
		? new Date(sortedItems[0].user_read_at)
		: null

	const now = new Date()

	const accountAgeDays = firstReadAt
		? Math.floor(
				(now.getTime() - firstReadAt.getTime()) / (1000 * 60 * 60 * 24),
			)
		: 0

	const accountAgeYears = Math.floor(accountAgeDays / 365)

	let totalPages = 0
	const authorsSet = new Set<string>()

	sortedItems.forEach((item: GoodreadsItem) => {
		const pages = Number(item.book?.num_pages || 0)
		totalPages += pages
		if (item.author_name) authorsSet.add(item.author_name)
	})

	const totalWords = totalPages * 250
	const totalDaysReading = Math.ceil(totalPages / 50)

	return {
		accountAgeYears,
		totalBooks,
		totalPages,
		totalWords,
		totalDaysReading,
		uniqueAuthors: authorsSet.size,
	}
}
