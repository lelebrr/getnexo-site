import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
    output: 'server',
    adapter: isVercel
        ? vercel({ webAnalytics: { enabled: true } })
        : node({ mode: 'standalone' }),
    site: 'https://getnexo.com.br/',
    integrations: [
        react(),
        // sitemap(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            },
        }),
    ],
});
