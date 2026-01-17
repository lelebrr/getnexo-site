```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';

export default defineConfig({
    site: 'https://jetnexo.com.br',
    integrations: [
        react(), 
        tailwind(), 
        sitemap(),
        partytown({
            config: { forward: ['dataLayer.push'] } 
        })
    ],
    compressHTML: true, // TTFB Optimization
    server: {
        port: 8080,
        host: true, 
        headers: {
            // Security & Perf Headers
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Cache-Control': 'public, max-age=31536000, immutable', // Edge Cache
        }
    },
    vite: {
        define: {
            'process.env.SENTRY_DSN': JSON.stringify(''),
            'process.env.NODE_ENV': JSON.stringify('production')
        },
        build: {
            minify: 'esbuild', 
            sourcemap: false,   
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) return 'vendor';
                    }
                }
            }
        }
    },
    root: '.',
});
```
