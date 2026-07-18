// Regenerates public/sitemap.xml from the actual destinations and blog
// post data, so it never goes stale as content is added. Run with:
//   node scripts/generate-sitemap.js
import { writeFileSync } from 'node:fs';
import { destinations } from '../src/data/destinations/index.js';
import blogPosts from '../src/data/blogPosts.js';

const BASE_URL = 'https://jarvis-ashy-nu.vercel.app';

const staticPages = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/explore', priority: '0.8', freq: 'monthly' },
  { path: '/explore-countries', priority: '0.7', freq: 'monthly' },
  { path: '/destinations', priority: '0.9', freq: 'weekly' },
  { path: '/trip-planner', priority: '0.7', freq: 'monthly' },
  { path: '/ai-guide', priority: '0.6', freq: 'monthly' },
  { path: '/travel-blog', priority: '0.7', freq: 'weekly' },
];

const urls = [
  ...staticPages.map((p) => ({ loc: `${BASE_URL}${p.path}`, priority: p.priority, freq: p.freq })),
  ...destinations.map((d) => ({
    loc: `${BASE_URL}/destinations/${d.slug}`,
    priority: '0.8',
    freq: 'monthly',
  })),
  ...blogPosts.map((p) => ({
    loc: `${BASE_URL}/travel-blog/${p.slug}`,
    priority: '0.6',
    freq: 'monthly',
  })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml regenerated with ${urls.length} URLs`);
