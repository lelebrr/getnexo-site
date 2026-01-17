export async function GET({ site }) {
    const pages = import.meta.glob('./**/*.astro');
    const baseUrl = site || 'https://jetnexo.com.br';

    const staticPages = [
        { url: '', changefreq: 'daily', priority: 1.0 },
        { url: '/funcionalidades', changefreq: 'weekly', priority: 0.8 },
        { url: '/blog', changefreq: 'daily', priority: 0.9 },
        { url: '/contato', changefreq: 'monthly', priority: 0.6 },
        { url: '/recursos', changefreq: 'weekly', priority: 0.7 },
    ];

    // Dynamically find blog posts
    const blogPosts = [];
    for (const path in pages) {
        if (path.includes('/blog/') && !path.includes('index.astro')) {
            const slug = path.split('/').pop().replace('.astro', '');
            blogPosts.push(slug);
        }
    }

    // Add the "conceptual" articles specifically requested by user if they don't exist yet
    const pendingArticles = ['ia-que-vende', 'como-dobrar-vendas', 'erros-que-sua-ia-comete'];
    pendingArticles.forEach(slug => {
        if (!blogPosts.includes(slug)) blogPosts.push(slug);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogPosts.map(slug => `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600' // Cache for 1 hour
        }
    });
}
