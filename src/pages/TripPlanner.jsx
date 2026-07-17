import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarRange, MapPin, Wallet, Check, Search, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ItineraryResult from '../components/ItineraryResult';
import { destinations } from '../data/destinations';
import { buildItinerary, TRIP_STYLES } from '../utils/itinerary';
import { usePageTitle } from '../hooks/usePageTitle';

export default function TripPlanner() {
  usePageTitle('Trip Planner');
  const [searchParams] = useSearchParams();
  const preselectSlug = searchParams.get('destination');
  const preselected = destinations.find((d) => d.slug === preselectSlug) || null;

  const [query, setQuery] = useState(preselected?.name || '');
  const [destSlug, setDestSlug] = useState(preselected?.slug || null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState('balanced');
  const [itinerary, setItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Coming from a destination page's "Plan a trip to X" button — arrives as
  // /trip-planner?destination=slug, so step 1 is already filled in.
  useEffect(() => {
    if (preselected) {
      setQuery(preselected.name);
      setDestSlug(preselected.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectSlug]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return destinations.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const selectedDestination = destinations.find((d) => d.slug === destSlug) || null;

  function pickDestination(d) {
    setDestSlug(d.slug);
    setQuery(d.name);
  }

  function generate() {
    if (!selectedDestination || isGenerating) return;
    setIsGenerating(true);
    setItinerary(null);
    // A short, honest processing beat — buildItinerary() itself is instant
    // (it's just formatting data already on the page), but showing that
    // briefly makes "Generate" feel like it did real work instead of
    // snapping into an already-computed answer.
    window.setTimeout(() => {
      const result = buildItinerary(selectedDestination, { startDate, endDate, style });
      setItinerary(result);
      setIsGenerating(false);
    }, 650);
  }

  return (
    <>
      <PageHeader
        icon={CalendarRange}
        eyebrow="Plan"
        title="Build your itinerary"
        subtitle="A simple, three-step trip planner — destinations, dates, budget."
      />
      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Step 1: destination */}
          <div className="relative rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6">
            <span className="absolute right-5 top-5 font-display text-3xl font-bold text-(--border-mid)">
              01
            </span>
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
              <MapPin size={18} />
            </span>
            <h3 className="font-display text-lg font-semibold text-(--text-primary)">
              Pick your destination
            </h3>
            <p className="mt-2 text-sm text-(--text-secondary)">
              Search one of Voyora's 32 destination guides.
            </p>
            <div className="relative mt-4">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDestSlug(null);
                  setItinerary(null);
                }}
                placeholder="e.g. Egypt, Tokyo..."
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) py-2 pl-8 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:border-(--border-mid) focus:outline-none"
              />
            </div>
            {matches.length > 0 && !destSlug && (
              <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                {matches.map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => pickDestination(d)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-(--text-primary) transition-colors hover:bg-(--surface-card-hover)"
                  >
                    {d.name}{' '}
                    <span className="text-(--text-secondary)">&middot; {d.country}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedDestination && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <Check size={13} /> {selectedDestination.name} selected
              </p>
            )}
          </div>

          {/* Step 2: dates */}
          <div className="relative rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6">
            <span className="absolute right-5 top-5 font-display text-3xl font-bold text-(--border-mid)">
              02
            </span>
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
              <CalendarRange size={18} />
            </span>
            <h3 className="font-display text-lg font-semibold text-(--text-primary)">
              Set your dates
            </h3>
            <p className="mt-2 text-sm text-(--text-secondary)">
              Optional — leave blank to use the destination's ideal stay length.
            </p>
            <div className="mt-4 space-y-2.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setItinerary(null);
                }}
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-sm text-(--text-primary) focus:border-(--border-mid) focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setItinerary(null);
                }}
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-sm text-(--text-primary) focus:border-(--border-mid) focus:outline-none"
              />
            </div>
          </div>

          {/* Step 3: style */}
          <div className="relative rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6">
            <span className="absolute right-5 top-5 font-display text-3xl font-bold text-(--border-mid)">
              03
            </span>
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
              <Wallet size={18} />
            </span>
            <h3 className="font-display text-lg font-semibold text-(--text-primary)">
              Set your pace
            </h3>
            <p className="mt-2 text-sm text-(--text-secondary)">
              How many stops should we fit into each day?
            </p>
            <div className="mt-4 space-y-2">
              {TRIP_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStyle(s.id);
                    setItinerary(null);
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                    style === s.id
                      ? 'border-(--border-mid) bg-(--surface-card-hover) text-(--text-primary)'
                      : 'border-(--border-soft) text-(--text-secondary) hover:border-(--border-mid)'
                  }`}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="block text-xs text-(--text-secondary)">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!selectedDestination || isGenerating}
          className="btn-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            'Generate my itinerary'
          )}
        </button>

        {isGenerating && (
          <div className="mt-8 animate-pulse rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
            <div className="h-3 w-28 rounded bg-(--surface-card-hover)" />
            <div className="mt-3 h-6 w-56 rounded bg-(--surface-card-hover)" />
            <div className="mt-6 space-y-3">
              <div className="h-14 rounded-xl bg-(--surface-card-hover)" />
              <div className="h-14 rounded-xl bg-(--surface-card-hover)" />
              <div className="h-14 rounded-xl bg-(--surface-card-hover)" />
            </div>
          </div>
        )}

        {!isGenerating && <ItineraryResult itinerary={itinerary} />}
      </section>
    </>
  );
}
