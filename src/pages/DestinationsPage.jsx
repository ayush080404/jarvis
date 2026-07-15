import { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUp, Globe, Search, Shuffle, X } from 'lucide-react';
import { useScrollY } from '../hooks/useScrollY';
import PageHeader from '../components/PageHeader';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';

const REGIONS = ['All', ...Array.from(new Set(destinations.map((d) => d.country))).sort()];

const REGION_COUNTS = REGIONS.reduce((acc, r) => {
  acc[r] = r === 'All' ? destinations.length : destinations.filter((d) => d.country === r).length;
  return acc;
}, {});

export default function DestinationsPage() {
  const [searchParams] = useSearchParams();
  const initialRegion = searchParams.get('region');
  const [region, setRegion] = useState(
    initialRegion && REGIONS.includes(initialRegion) ? initialRegion : 'All'
  );
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const gridTopRef = useRef(null);
  const scrollY = useScrollY();

  const filtered = useMemo(() => {
    const byRegion = region === 'All' ? destinations : destinations.filter((d) => d.country === region);
    const q = query.trim().toLowerCase();
    if (!q) return byRegion;
    return byRegion.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
  }, [region, query]);

  function surpriseMe() {
    const pick = destinations[Math.floor(Math.random() * destinations.length)];
    navigate(`/destinations/${pick.slug}`);
  }

  return (
    <>
      <PageHeader
        icon={Globe}
        eyebrow={`${destinations.length} destinations`}
        title="Where would you like to go?"
        subtitle="Every destination guide currently live on Voyora"
      />

      {/* Sticky filter bar: stays reachable while scrolling through many cards,
          so switching region or searching never requires scrolling back up. */}
      <div className="sticky top-20 z-40 w-full border-b border-(--border-soft) bg-(--surface)/85 px-4 py-4 backdrop-blur-md sm:top-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                  region === r
                    ? 'border-(--border-mid) bg-(--surface-card-hover) text-(--text-primary)'
                    : 'border-(--border-soft) text-(--text-secondary) hover:border-(--border-mid) hover:text-(--text-primary)'
                }`}
              >
                {r}
                <span className="ml-1.5 opacity-60">{REGION_COUNTS[r]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:shrink-0">
            <div className="relative w-full lg:w-64">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations..."
                className="w-full rounded-full border border-(--border-soft) bg-(--input-bg) py-2 pl-9 pr-8 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:border-(--border-mid) focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-(--text-secondary) hover:text-(--text-primary)"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              onClick={surpriseMe}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-(--border-soft) px-4 py-2 text-xs font-semibold uppercase tracking-wide text-(--text-primary) transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
            >
              <Shuffle size={14} />
              Surprise me
            </button>
          </div>
        </div>
      </div>

      <section ref={gridTopRef} className="mx-auto max-w-6xl px-6 pb-24 pt-8 lg:px-10">
        <p className="mb-5 text-sm text-(--text-secondary)">
          {filtered.length} destination{filtered.length === 1 ? '' : 's'}
          {query.trim() ? ` matching "${query.trim()}"` : ''}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-10 text-center">
            <p className="text-(--text-primary)">No destinations match that search.</p>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Try a different name, or clear the filter to see everything.
            </p>
          </div>
        )}
      </section>

      {/* Floating back-to-top control, useful once the page has scrolled past
          a couple of screens' worth of destination cards. */}
      {scrollY > 600 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-(--border-soft) bg-(--surface-card) text-(--text-primary) shadow-lg backdrop-blur transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}

