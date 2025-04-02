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
	build: {
		format: 'file',
	},
	prefetch: {
		defaultStrategy: 'viewport',
	},

	vite: {
		ssr: {
			external: ['node:fs/promises'],
		},
		plugins: [tailwindcss()],
		resolve: {
			// Use react-dom/server.edge instead of react-dom/server.browser for React 19.
			// Without this, MessageChannel from node:worker_threads needs to be polyfilled.
			alias: import.meta.env.PROD && {
				'react-dom/server': 'react-dom/server.edge',
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
