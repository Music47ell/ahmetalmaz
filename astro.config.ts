import { loadEnv } from "vite";

import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import umami from '@yeskunall/astro-umami';

import siteMetadata from './src/data/siteMetadata'

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

const { UMAMI_URL, UMAMI_ID } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
    site: siteMetadata.siteUrl,
    trailingSlash: 'never',
    output: 'server',
    server: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    build: {
        format: 'file',
    },
    prefetch: {
        defaultStrategy: 'viewport',
    },
    vite: {
        define: {
            'process.env.WP_GRAPHQL_URL': JSON.stringify(process.env.WP_GRAPHQL_URL),
            'process.env.WEBHOOK_SECRET': JSON.stringify(process.env.WEBHOOK_SECRET),
        },
        ssr: {
            external: ['node:fs/promises', 'jsdom'],
        },
        plugins: [tailwindcss()],
        // resolve: {
        //     // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
        //     // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
        //     alias: import.meta.env.PROD && {
        //         'react-dom/server': 'react-dom/server.edge',
        //     },
        // },
    },
    integrations: [react(), umami({
        // doNotTrack: true,
        endpointUrl: UMAMI_URL,
        id: UMAMI_ID,
    })],
    adapter: cloudflare(),
})