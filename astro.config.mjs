import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://getnexo.com.br/',
    integrations: [
        // sitemap(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            },
        }),
    ],
});
