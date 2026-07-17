import { Link } from 'react-router-dom';
import { Globe as GlobeIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { destinations } from '../data/destinations';
import { usePageTitle } from '../hooks/usePageTitle';

const regionCounts = destinations.reduce((acc, d) => {
  acc[d.country] = (acc[d.country] || 0) + 1;
  return acc;
}, {});

const regions = Object.entries(regionCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

export default function ExploreCountries() {
  usePageTitle('Explore Countries');
  return (
    <>
      <PageHeader
        icon={GlobeIcon}
        eyebrow={`${destinations.length} destinations`}
        title="Browse by region"
        subtitle="Every region we currently cover on Voyora, and how many guides live there."
      />
      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <Link
              key={r.name}
              to={`/destinations?region=${encodeURIComponent(r.name)}`}
              className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
            >
              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                {r.name}
              </h3>
              <p className="mt-1 text-sm text-(--text-secondary)">
                {r.count} {r.count === 1 ? 'destination' : 'destinations'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
