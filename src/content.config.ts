import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/content" }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string().optional(),
		slug: z.string().optional(),
		draft: z.boolean().default(false),
		category: z.string(),
		tags: z.array(z.string()),
		published: z.coerce.date(),
		updated: z.coerce.date(),
		toot: z.string().optional(),
	})
});

export const collections = { posts };