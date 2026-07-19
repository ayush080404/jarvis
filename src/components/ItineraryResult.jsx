import { CalendarDays, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function ItineraryResult({ itinerary }) {
  if (!itinerary) return null;
  const { legs, totalDays } = itinerary;

  return (
    <div className="page-transition mt-8 space-y-6">
      {legs.length > 1 && (
        <p className="text-sm font-medium text-(--text-secondary)">
          {totalDays} days across {legs.length} destinations
        </p>
      )}

      {legs.map((leg) => (
        <LegCard key={leg.destination.slug} leg={leg} multi={legs.length > 1} />
      ))}
    </div>
  );
}

function LegCard({ leg, multi }) {
  const { destination, days, foodPicks, experiencePicks } = leg;
  const { name, accentColor, bestTime, currency, heroImage } = destination;
  const dayRange =
    days.length > 0 ? `Day ${days[0].day}${days.length > 1 ? `\u2013${days[days.length - 1].day}` : ''}` : '';

  return (
    <div className="overflow-hidden rounded-3xl border border-(--border-soft) bg-(--surface-card)">
      {heroImage && (
        <div className="relative h-40 w-full sm:h-48">
          <img src={heroImage} alt={name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {multi ? dayRange : 'Starter itinerary'}
              </p>
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                {days.length} days in {name}
              </h3>
            </div>
            <span
              title={bestTime}
              className="max-w-[10rem] shrink-0 truncate rounded-full px-3 py-1 text-xs font-semibold text-white sm:max-w-[13rem]"
              style={{ backgroundColor: accentColor }}
            >
              {bestTime}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {!heroImage && (
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                {multi ? dayRange : 'Starter itinerary'}
              </p>
              <h3 className="font-display text-xl font-semibold text-(--text-primary)">
                {days.length} days in {name}
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
        )}

        <p className="text-xs text-(--text-secondary)">
          Built from Voyora's {name} guide — currency is {currency}. This is a quick starting
          point, not a fully custom AI plan (that's coming soon in AI Guide).
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
    </div>
  );
}
