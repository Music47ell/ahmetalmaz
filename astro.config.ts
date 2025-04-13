import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

import {
	astroExpressiveCodeOptions,
	remarkModifiedTime,
	remarkReadingTime,
} from './src/libs/remark'
import { rehypeExternalUrlsFavicon, rehypeAffiliateLinks } from './src/libs/rehype'
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
		define: {
			'process.env.TMDB_API_TOKEN': JSON.stringify(process.env.TMDB_API_TOKEN),
			'process.env.TRAKT_CLIENT_ID': JSON.stringify(
				process.env.TRAKT_CLIENT_ID,
			),
			'process.env.USERNAME': JSON.stringify(process.env.USERNAME),
			'process.env.REPO': JSON.stringify(process.env.REPO),
			'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
			'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
			'process.env.DATABASE_AUTH_TOKEN': JSON.stringify(
				process.env.DATABASE_AUTH_TOKEN,
			),
		},
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

	markdown: {
		remarkPlugins: [remarkModifiedTime, remarkReadingTime],
		rehypePlugins: [rehypeAffiliateLinks, rehypeExternalUrlsFavicon],
	},
	integrations: [
		astroExpressiveCode(astroExpressiveCodeOptions()),
		mdx(),
		react(),
	],
	adapter: cloudflare({
		imageService: 'compile',
	}),
})
