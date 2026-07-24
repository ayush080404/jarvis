import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Wallet, Users, CalendarDays, Home, Utensils, Bus, Ticket, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { destinations } from '../data/destinations';
import { tripBudgets, TIERS } from '../data/tripBudgets';
import { slugToCurrency, formatLocalAmount } from '../data/currencyRates';
import { estimateTripCost, parseIdealStayDays } from '../utils/budgetEstimator';
import { usePageTitle } from '../hooks/usePageTitle';

// Only destinations we actually have cost data for are selectable — better
// to keep the list honest than to silently fall back to a generic average
// for places we haven't estimated.
const estimable = destinations.filter((d) => tripBudgets[d.slug]);

const BREAKDOWN_ROWS = [
  { key: 'accommodation', label: 'Accommodation', icon: Home },
  { key: 'food', label: 'Food & drink', icon: Utensils },
  { key: 'transport', label: 'Local transport', icon: Bus },
  { key: 'activities', label: 'Activities', icon: Ticket },
];

export default function BudgetEstimator() {
  usePageTitle('Trip Budget Estimator');
  const [searchParams] = useSearchParams();
  const preselectSlug = searchParams.get('slug');
  const preselected = estimable.find((d) => d.slug === preselectSlug) || null;

  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState(preselected);
  const [days, setDays] = useState(preselected ? parseIdealStayDays(preselected.idealStay) : 5);
  const [travelers, setTravelers] = useState(1);
  const [tier, setTier] = useState('midRange');
  const [showLocal, setShowLocal] = useState(false);

  // A different destination means a different local currency (or none, for
  // USD-priced places like New York) — always reset to USD rather than
  // silently showing e.g. Yen amounts under a Paris estimate.
  useEffect(() => {
    setShowLocal(false);
  }, [destination]);

  const localCurrencyCode = destination ? slugToCurrency[destination.slug] : null;
  const hasLocalCurrency = localCurrencyCode && localCurrencyCode !== 'USD';

  function displayAmount(usdValue) {
    if (showLocal && destination) {
      const local = formatLocalAmount(usdValue, destination.slug);
      if (local) return `${local.symbol}${local.amount.toLocaleString()}`;
    }
    return `$${usdValue.toLocaleString()}`;
  }

  // If someone arrives via a "Estimate this trip" link from a different
  // destination page later in the same session, keep the form in sync.
  useEffect(() => {
    if (preselected) {
      setDestination(preselected);
      setDays(parseIdealStayDays(preselected.idealStay));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectSlug]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return estimable
      .filter((d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const estimate = useMemo(() => {
    if (!destination) return null;
    return estimateTripCost({ slug: destination.slug, days, travelers, tier });
  }, [destination, days, travelers, tier]);

  return (
    <>
      <PageHeader
        eyebrow="Budget"
        title="What will this trip actually cost?"
        subtitle="A rough per-person estimate for accommodation, food, transport, and activities — flights not included."
        images={estimable.slice(0, 4).map((d) => d.heroImage)}
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-10 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Inputs */}
          <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6">
            <h3 className="font-display text-lg font-semibold text-(--text-primary)">
              Trip details
            </h3>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Destination
              </label>
              {destination ? (
                <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-(--border-soft) p-2">
                  <img
                    src={destination.heroImage}
                    alt={destination.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-(--text-primary)">{destination.name}</p>
                    <p className="text-xs text-(--text-secondary)">{destination.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDestination(null)}
                    className="shrink-0 text-xs font-medium text-sky-500 hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. Egypt, Tokyo..."
                      className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) py-2 pl-8 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
                    />
                  </div>
                  {matches.length > 0 && (
                    <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                      {matches.map((d) => (
                        <button
                          key={d.slug}
                          type="button"
                          onClick={() => {
                            setDestination(d);
                            setDays(parseIdealStayDays(d.idealStay));
                            setQuery('');
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-(--text-primary) transition-colors hover:bg-(--surface-card-hover)"
                        >
                          {d.name} <span className="text-(--text-secondary)">&middot; {d.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-(--text-secondary)">
                  <CalendarDays size={14} /> Days
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-sm text-(--text-primary) transition-colors focus:border-(--border-mid) focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-(--text-secondary)">
                  <Users size={14} /> Travelers
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-3 py-2 text-sm text-(--text-primary) transition-colors focus:border-(--border-mid) focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Travel style
              </label>
              <div className="space-y-2">
                {TIERS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTier(t.key)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors ${
                      tier === t.key
                        ? 'border-(--border-mid) bg-(--surface-card-hover) text-(--text-primary)'
                        : 'border-(--border-soft) text-(--text-secondary) hover:border-(--border-mid)'
                    }`}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="block text-xs text-(--text-secondary)">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6">
            <h3 className="font-display text-lg font-semibold text-(--text-primary)">
              Estimated cost
            </h3>

            {!destination ? (
              <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
                <Wallet size={28} className="text-(--text-secondary)" />
                <p className="mt-3 text-sm text-(--text-secondary)">
                  Pick a destination to see a cost estimate.
                </p>
              </div>
            ) : (
              estimate && (
                <>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
                        Total for {estimate.travelers} traveler{estimate.travelers > 1 ? 's' : ''},{' '}
                        {estimate.days} day{estimate.days > 1 ? 's' : ''}
                      </p>
                      <p className="font-display text-4xl font-bold text-(--text-primary)">
                        {displayAmount(estimate.totalUSD)}
                      </p>
                      <p className="mt-1 text-sm text-(--text-secondary)">
                        {showLocal && <>(~${estimate.totalUSD.toLocaleString()} USD) &middot; </>}
                        ~{displayAmount(estimate.perDayTotal)}/day
                      </p>
                    </div>
                  </div>

                  {hasLocalCurrency && (
                    <div className="mt-3 inline-flex rounded-full border border-(--border-soft) p-1 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setShowLocal(false)}
                        className={`rounded-full px-3 py-1.5 transition-colors ${
                          !showLocal
                            ? 'bg-(--surface-card-hover) text-(--text-primary)'
                            : 'text-(--text-secondary)'
                        }`}
                      >
                        USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLocal(true)}
                        className={`rounded-full px-3 py-1.5 transition-colors ${
                          showLocal
                            ? 'bg-(--surface-card-hover) text-(--text-primary)'
                            : 'text-(--text-secondary)'
                        }`}
                      >
                        {localCurrencyCode}
                      </button>
                    </div>
                  )}

                  <div className="mt-5 space-y-3">
                    {BREAKDOWN_ROWS.map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--surface-card-hover) text-(--text-secondary)">
                          <Icon size={14} />
                        </span>
                        <span className="flex-1 text-sm text-(--text-secondary)">{label}</span>
                        <span className="text-sm font-medium text-(--text-primary)">
                          {displayAmount(estimate.breakdown[key])}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-start gap-2 rounded-xl border border-(--border-soft) p-3.5">
                    <Info size={14} className="mt-0.5 shrink-0 text-(--text-secondary)" />
                    <p className="text-xs text-(--text-secondary)">
                      A rough planning estimate, not a live quote — actual costs vary with season,
                      exact dates, and personal spending habits. Flights aren't included since
                      they depend heavily on where you're flying from.
                      {hasLocalCurrency && ' Currency conversion is an approximate reference rate, not a live rate.'}
                    </p>
                  </div>

                  <Link
                    to={`/trip-planner?destination=${destination.slug}`}
                    className="mt-5 inline-block text-sm font-medium text-sky-500 hover:underline"
                  >
                    Build a full itinerary for {destination.name} &rarr;
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
