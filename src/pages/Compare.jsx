import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  Search,
  X,
  Plus,
  Calendar,
  Coins,
  CalendarRange,
  Languages,
  Plane,
  Stamp,
  Layers,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { destinations } from '../data/destinations';
import { usePageTitle } from '../hooks/usePageTitle';

const MAX_SLOTS = 3;

const ROWS = [
  { key: 'bestTime', label: 'Best time', icon: Calendar },
  { key: 'idealStay', label: 'Ideal stay', icon: CalendarRange },
  { key: 'currency', label: 'Currency', icon: Coins },
  { key: 'language', label: 'Language', icon: Languages },
  { key: 'nearestAirport', label: 'Nearest airport', icon: Plane },
  { key: 'visaNote', label: 'Visa', icon: Stamp },
];

function spotCount(d) {
  return d.placesToVisit?.length || d.highlights?.length || 0;
}

function PickerSlot({ index, destination, onPick, onClear, excludeSlugs }) {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return destinations
      .filter((d) => !excludeSlugs.includes(d.slug) && d.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, excludeSlugs]);

  if (destination) {
    return (
      <div className="overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-card)">
        <div className="relative h-32 w-full">
          <img src={destination.heroImage} alt={destination.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${destination.name}`}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            <X size={13} />
          </button>
          <p className="absolute bottom-2 left-3 font-display text-base font-semibold text-white">
            {destination.name}
          </p>
        </div>
        <p className="px-3 py-2 text-xs text-(--text-secondary)">{destination.country}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-(--border-soft) bg-(--surface-card) p-5">
      <div className="mb-3 flex items-center gap-2 text-(--text-secondary)">
        <Plus size={16} />
        <span className="text-sm font-medium">Add destination {index + 1}</span>
      </div>
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a destination..."
          className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) py-2 pl-8 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
        />
      </div>
      {matches.length > 0 && (
        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
          {matches.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => {
                onPick(d);
                setQuery('');
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-(--text-primary) transition-colors hover:bg-(--surface-card-hover)"
            >
              {d.name} <span className="text-(--text-secondary)">&middot; {d.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  usePageTitle('Compare Destinations');
  const [slugs, setSlugs] = useState([null, null, null]);

  const picked = slugs.map((s) => destinations.find((d) => d.slug === s) || null);
  const filledCount = picked.filter(Boolean).length;

  function pick(index, d) {
    setSlugs((prev) => {
      const next = [...prev];
      next[index] = d.slug;
      return next;
    });
  }

  function clear(index) {
    setSlugs((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }

  return (
    <>
      <PageHeader
        icon={GitCompare}
        eyebrow="Decide"
        title="Compare destinations"
        subtitle="Put up to 3 destinations side by side — season, cost of visit, pace, and more."
        images={['/images/paris.jpg', '/images/fuji_cherry_blossoms.jpg', '/images/santorini_blue_domes.jpg']}
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {slugs.map((slug, i) => (
            <PickerSlot
              key={i}
              index={i}
              destination={picked[i]}
              onPick={(d) => pick(i, d)}
              onClear={() => clear(i)}
              excludeSlugs={slugs.filter(Boolean)}
            />
          ))}
        </div>

        {filledCount >= 2 ? (
          <div className="mt-10 overflow-x-auto rounded-2xl border border-(--border-soft)">
            <table className="w-full min-w-[500px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--border-soft) bg-(--surface-card)">
                  <th className="w-40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                    &nbsp;
                  </th>
                  {picked.map((d, i) =>
                    d ? (
                      <th
                        key={d.slug}
                        className="px-4 py-3 font-display text-sm font-semibold text-(--text-primary)"
                        style={{ color: d.accentColor }}
                      >
                        {d.name}
                      </th>
                    ) : (
                      <th key={i} className="px-4 py-3" />
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-(--border-soft)">
                  <td className="flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
                    <Layers size={13} />
                    Places to explore
                  </td>
                  {picked.map((d, i) =>
                    d ? (
                      <td key={d.slug} className="px-4 py-3 text-(--text-primary)">
                        {spotCount(d)} spots
                      </td>
                    ) : (
                      <td key={i} className="px-4 py-3 text-(--text-secondary)">
                        &mdash;
                      </td>
                    )
                  )}
                </tr>
                {ROWS.map(({ key, label, icon: Icon }) => (
                  <tr key={key} className="border-b border-(--border-soft) last:border-0">
                    <td className="flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
                      <Icon size={13} />
                      {label}
                    </td>
                    {picked.map((d, i) =>
                      d ? (
                        <td key={d.slug} className="px-4 py-3 text-(--text-primary)">
                          {d[key] || '—'}
                        </td>
                      ) : (
                        <td key={i} className="px-4 py-3 text-(--text-secondary)">
                          &mdash;
                        </td>
                      )
                    )}
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
                    Guide
                  </td>
                  {picked.map((d, i) =>
                    d ? (
                      <td key={d.slug} className="px-4 py-3">
                        <Link
                          to={`/destinations/${d.slug}`}
                          className="text-xs font-medium text-sky-500 hover:underline"
                        >
                          View full guide &rarr;
                        </Link>
                      </td>
                    ) : (
                      <td key={i} className="px-4 py-3" />
                    )
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-(--text-secondary)">
            Add at least 2 destinations above to see them compared.
          </p>
        )}
      </section>
    </>
  );
}
