import { defineConfig, envField } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

import siteMetadata from './src/data/siteMetadata'

import mdx from '@astrojs/mdx';
import {
	astroExpressiveCodeOptions,
	remarkReadingTime,
	remarkMastodonToot,
} from './src/lib/remark'
import { rehypeExternalUrlsFavicon } from './src/lib/rehype'
import astroExpressiveCode from 'astro-expressive-code'

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false
	},

	site: siteMetadata.siteUrl,
	trailingSlash: 'never',
	output: 'server',

	// server: {
	//     host: true,
	//     headers: {
	//         'Access-Control-Allow-Origin': '*',
	//     },
	// },

	env: {
		schema: {
			API_BASE_URL: envField.string({
				context: 'client',
				access: 'public',
				optional: false,
			}),
		},
	},

	build: {
		format: 'file',
	},

	prefetch: {
		defaultStrategy: 'viewport',
	},

	vite: {
		ssr: {
		    external: ['node:fs/promises', 'jsdom'],
		},
		plugins: [tailwindcss()],
		// resolve: {
		// 	// Use react-dom/server.edge instead of react-dom/server.browser for React 19.
		// 	// Without this, MessageChannel from node:worker_threads needs to be polyfilled.
		// 	alias: import.meta.env.PROD && {
		// 		'react-dom/server': 'react-dom/server.edge',
		// 	},
		// },
	},

	markdown: {
		remarkPlugins: [remarkReadingTime, remarkMastodonToot],
		rehypePlugins: [rehypeExternalUrlsFavicon],
	},

	integrations: [
		astroExpressiveCode(astroExpressiveCodeOptions()), react(), mdx()],

	adapter: cloudflare({
		prerenderEnvironment: 'node',
	}),
})
