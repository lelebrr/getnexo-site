import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
    site: 'https://getnexo.com.br/',
    integrations: [
        react(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            },
        }),
    ],
});
