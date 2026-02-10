import { defineConfig, envField } from 'astro/config'
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'

import siteMetadata from './src/data/siteMetadata'

// https://astro.build/config
export default defineConfig({
    site: siteMetadata.siteUrl,
    trailingSlash: 'never',
    output: 'server',
    server: {
      host: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    env: {
        schema: {
            API_BASE_URL: envField.string({
                context: "client", access: "public", optional: true
            }),
            INSIGHT_TOKEN: envField.string({
                context: "client", access: "public", optional: true
            }),
            WP_REST_URL: envField.string({
                context: "server", access: "secret", optional: true
            }),
        }
    },
    build: {
        format: 'file',
    },
    prefetch: {
        defaultStrategy: 'viewport',
    },
    vite: {
        // ssr: {
        //     external: ['node:fs/promises', 'jsdom'],
        // },
        plugins: [tailwindcss()],
        resolve: {
            // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
            // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
            alias: import.meta.env.PROD && {
                'react-dom/server': 'react-dom/server.edge',
            },
        },
    },
    integrations: [react()],
    adapter: node({
    mode: 'standalone',
  }),
})