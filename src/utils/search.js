import { destinations } from '../data/destinations';
import blogPosts from '../data/blogPosts';

const THEME_ENTRIES = [
  { theme: 'culture', label: 'Culture & History', desc: 'Browse by theme' },
  { theme: 'nature', label: 'Nature & Adventure', desc: 'Browse by theme' },
  { theme: 'food-nightlife', label: 'Food & Nightlife', desc: 'Browse by theme' },
];

// One flat, ranked list across every searchable thing on the site —
// destinations first (the core content), then blog posts, then theme
// shortcuts — so the search box and its keyboard navigation only ever
// have to deal with a single array, not three.
export function searchSite(query, { limit = 8 } = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const destResults = destinations
    .filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((d) => ({
      type: 'destination',
      key: `destination-${d.slug}`,
      title: d.name,
      subtitle: `${d.country} \u00b7 ${d.tag}`,
      to: `/destinations/${d.slug}`,
    }));

  const blogResults = blogPosts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    )
    .slice(0, 2)
    .map((p) => ({
      type: 'blog',
      key: `blog-${p.slug}`,
      title: p.title,
      subtitle: `${p.tag} \u00b7 ${p.readTime}`,
      to: `/travel-blog/${p.slug}`,
    }));

  const themeResults = THEME_ENTRIES.filter((t) => t.label.toLowerCase().includes(q))
    .slice(0, 2)
    .map((t) => ({
      type: 'theme',
      key: `theme-${t.theme}`,
      title: t.label,
      subtitle: t.desc,
      to: `/destinations?theme=${t.theme}`,
    }));

  return [...destResults, ...blogResults, ...themeResults].slice(0, limit);
}
