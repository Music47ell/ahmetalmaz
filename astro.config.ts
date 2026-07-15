import { defineConfig, envField } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { unified } from '@astrojs/markdown-remark'

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
		format: 'directory',
	},

	prefetch: {
		defaultStrategy: 'viewport',
	},

	vite: {
		ssr: {
		    external: ['node:fs/promises', 'jsdom'],
		},
		plugins: [tailwindcss()],
	},

	markdown: {
		processor: unified({
			remarkPlugins: [remarkReadingTime, remarkMastodonToot],
			rehypePlugins: [rehypeExternalUrlsFavicon],
		}),
	},

	integrations: [
		astroExpressiveCode(astroExpressiveCodeOptions()), react({ experimentalDisableStreaming: true }), mdx()],

	adapter: cloudflare({
		prerenderEnvironment: 'node',
	}),
})
