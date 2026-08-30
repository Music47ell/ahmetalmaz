import { XMLParser } from 'fast-xml-parser'
import { getGoodreadsReadFeed } from '../env'

type GoodreadsItem = {
	title?: string
	link?: string
	user_rating?: string
	user_read_at?: string
	book_medium_image_url?: string
	book?: { num_pages?: string }
	author_name?: string
}

type GoodreadsFeed = {
	rss?: {
		channel?: {
			item?: GoodreadsItem | GoodreadsItem[]
		}
	}
}

export const getGoodreadsReadBooks = async () => {
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
	const xml = await res.text()

	const parser = new XMLParser({
		ignoreAttributes: false,
		removeNSPrefix: true,
	})
	const json = parser.parse(xml) as GoodreadsFeed

	const channel = json.rss?.channel
	if (!channel) throw new Error('No channel found in feed')

	const rawItems = Array.isArray(channel.item) ? channel.item : [channel.item]

	const sortedItems = rawItems.sort(
		(a: GoodreadsItem, b: GoodreadsItem) =>
			new Date(b.user_read_at ?? '').getTime() -
			new Date(a.user_read_at ?? '').getTime(),
	)

	const last10 = sortedItems.slice(0, 10).map((item: GoodreadsItem) => {
		const fullTitle = item.title ?? ''
		const titleUpToColon = fullTitle.split(':')[0].trim()

		return {
			title: titleUpToColon,
			link: item.link ?? '',
			rating: item.user_rating ?? '',
			poster: item.book_medium_image_url ?? '',
		}
	})

	return last10
}
