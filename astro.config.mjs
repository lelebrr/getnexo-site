import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
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
