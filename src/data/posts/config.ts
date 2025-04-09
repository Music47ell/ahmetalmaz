import { z, defineCollection } from 'astro:content'

const contentCollection = defineCollection({
	type: 'entries',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().max(160),
			tags: z.array(z.string()).optional(),
			cover: z
				.object({
					src: image(),
					alt: z.string(),
					credit: z.string().optional(),
				})
				.optional(),
			published_at: z.date(),
			source: z.string().url().optional(),
		}),
})

export const collections = {
	content: contentCollection,
}
