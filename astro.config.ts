import { loadEnv } from "vite";
import { defineConfig } from 'astro/config'
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'
import umami from '@yeskunall/astro-umami';

import siteMetadata from './src/data/siteMetadata'
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
    integrations: [react(), umami({
        doNotTrack: true,
        endpointUrl: UMAMI_URL,
        id: UMAMI_ID,
    })],
    adapter: node({
    mode: 'standalone',
  }),
})