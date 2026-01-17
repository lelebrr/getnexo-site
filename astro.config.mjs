import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://getnexo.com.br',
    integrations: [
        react(),
        tailwind(),
        sitemap(),
        partytown({
            config: { forward: ['dataLayer.push'] }
        })
    ],
    compressHTML: true,
    vite: {
        build: {
            minify: 'esbuild',
            sourcemap: false,
            cssCodeSplit: true,
        }
    }
});
