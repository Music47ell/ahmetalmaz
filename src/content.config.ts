import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string().max(160),
		tags: z.array(z.string()).optional(),
		cover: z
			.object({
				src: z.string(),
				alt: z.string(),
				credit: z.string().optional(),
			})
			.optional(),
		published_at: z.date(),
		source: z.string().url().optional(),
	}),
})

export const collections = { posts }
