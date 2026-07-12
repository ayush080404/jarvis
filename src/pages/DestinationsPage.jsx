import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';

const REGIONS = ['All', ...Array.from(new Set(destinations.map((d) => d.country))).sort()];

export default function DestinationsPage() {
  const [searchParams] = useSearchParams();
  const initialRegion = searchParams.get('region');
  const [region, setRegion] = useState(
    initialRegion && REGIONS.includes(initialRegion) ? initialRegion : 'All'
  );

  const filtered = useMemo(
    () => (region === 'All' ? destinations : destinations.filter((d) => d.country === region)),
    [region]
  );

  return (
    <>
      <PageHeader
        icon={Globe}
        eyebrow={`${destinations.length} destinations`}
        title="Where would you like to go?"
        subtitle="Every destination guide currently live on Voyora."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="mb-8 flex flex-wrap gap-2">
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
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </section>
    </>
  );
}
