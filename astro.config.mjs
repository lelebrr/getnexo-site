import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    site: 'https://getnexo.com.br/',
    integrations: [
        react(),
        sitemap(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            },
        }),
    ],
});
