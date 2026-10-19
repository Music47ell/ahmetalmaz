import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import astroExpressiveCode from 'astro-expressive-code'
import { config as loadEnv } from 'dotenv'
import siteMetadata from './src/data/siteMetadata'
import { rehypeExternalUrlsFavicon } from './src/lib/rehype'
import {
	astroExpressiveCodeOptions,
	remarkMastodonToot,
	remarkReadingTime,
} from './src/lib/remark'

loadEnv({ override: true, path: '.env' })

const isDev = process.env.NODE_ENV === 'development'

// https://astro.build/config
export default defineConfig({
	devToolbar: {
		enabled: false,
	},

	site: siteMetadata.siteUrl,
	trailingSlash: 'never',
	output: 'server',

	env: {
		schema: {
			TURSO_DATABASE_URL: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			TURSO_AUTH_TOKEN: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			USERNAME: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			TRAKT_CLIENT_ID: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			TMDB_API_TOKEN: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			STEAM_API_KEY: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			STEAM_USER_ID: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			MONKEYTYPE_API_KEY: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			MONKEYTYPE_USERNAME: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			SIMKL_CLIENT_ID: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			SIMKL_USER_ID: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			SIMKL_ACCESS_TOKEN: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			LASTFM_API_KEY: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			GOODREADS_READ_FEED: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
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
		astroExpressiveCode(astroExpressiveCodeOptions()),
		react(),
		mdx(),
	],

	adapter: isDev
		? undefined
		: node({
				mode: 'standalone',
			}),
})
