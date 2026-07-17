import { CalendarDays, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function ItineraryResult({ itinerary }) {
  if (!itinerary) return null;
  const { destination, tripLength, days, foodPicks, experiencePicks } = itinerary;
  const { name, accentColor, bestTime, currency } = destination;

  return (
    <div className="mt-8 rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
            Starter itinerary
          </p>
          <h3 className="font-display text-xl font-semibold text-(--text-primary)">
            {tripLength} days in {name}
          </h3>
        </div>
        <span
          title={bestTime}
          className="max-w-[13rem] truncate rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {bestTime}
        </span>
      </div>

      <p className="mt-3 text-xs text-(--text-secondary)">
        Built from Voyora's {name} guide — currency is {currency}. This is a quick starting point,
        not a fully custom AI plan (that's coming soon in AI Guide).
      </p>

      <div className="mt-5 space-y-3">
        {days.map((d, i) => (
          <div
            key={d.day}
            className="page-transition flex gap-3 rounded-xl border border-(--border-soft) p-4"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <CalendarDays size={14} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                Day {d.day}
              </p>
              <p className="mt-1 text-sm text-(--text-primary)">{d.places.join(' · ')}</p>
            </div>
          </div>
        ))}
      </div>

      {experiencePicks.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
            <Sparkles size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
              Don&apos;t miss
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-(--text-secondary)">
            {experiencePicks.map((exp) => (
              <li key={exp}>&bull; {exp}</li>
            ))}
          </ul>
        </div>
      )}

      {foodPicks.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
            <UtensilsCrossed size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
              Try the food
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {foodPicks.map((food) => (
              <span
                key={food}
                className="rounded-full border border-(--border-soft) px-3 py-1 text-xs font-medium text-(--text-primary)"
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
