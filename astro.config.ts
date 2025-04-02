import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

import {
	astroExpressiveCodeOptions,
	remarkModifiedTime,
	remarkReadingTime,
} from './src/libs/remark'
import siteMetadata from './src/data/siteMetadata'
import astroExpressiveCode from 'astro-expressive-code'

import cloudflare from '@astrojs/cloudflare'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
	site: siteMetadata.siteUrl,
	trailingSlash: 'never',
	output: 'server',

	prefetch: {
		defaultStrategy: 'viewport',
	},

	vite: {
		ssr: {
			external: ['node:fs/promises'],
		},
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': '/src',
			},
		},
	},

	markdown: { remarkPlugins: [remarkModifiedTime, remarkReadingTime] },
	integrations: [
		astroExpressiveCode(astroExpressiveCodeOptions()),
		mdx(),
		react(),
	],
	adapter: cloudflare({
		imageService: 'compile',
	}),
})
