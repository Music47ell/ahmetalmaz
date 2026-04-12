// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { toString } from 'mdast-util-to-string'
import type { Parent } from 'unist'

export type Stats = {
	wordCount: number
	readingTime: number
}

const WORDS_PER_MINUTE = 200

function getReadingTime(content: string) {
	if (!content) return
	const clean = content.replace(/<\/?[^>]+(>|$)/g, '')
	const wordCount = Number(clean.split(/\s/g).length)
	const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
	return { wordCount, readingTime }
}

export default function remarkReadingTime() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (tree: Parent, { data }: any) => {
		const textOnPage = toString(tree)
		const { wordCount, readingTime } = getReadingTime(textOnPage) || {
			wordCount: 0,
			readingTime: 0,
		}

		data.astro.frontmatter.wordCount = wordCount
		data.astro.frontmatter.readingTime = readingTime
	}
}