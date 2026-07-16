import { useState } from 'react';
import { BookMarked } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ItineraryResult from '../components/ItineraryResult';
import { destinations } from '../data/destinations';
import { buildItinerary, TRIP_STYLES } from '../utils/itinerary';

export default function PlanMyTrip() {
  const [destinationName, setDestinationName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState('balanced');
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setItinerary(null);

    const name = destinationName.trim().toLowerCase();
    if (!name) {
      setError('Tell us where you want to go first.');
      return;
    }

    const match = destinations.find(
      (d) => d.name.toLowerCase() === name || d.name.toLowerCase().includes(name)
    );

    if (!match) {
      setError(
        `We don't have a guide for "${destinationName}" yet — try one of Voyora's 32 destinations, like Egypt, Tokyo, or Paris.`
      );
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('Your end date is before your start date — double-check those.');
      return;
    }

    setItinerary(buildItinerary(match, { startDate, endDate, style }));
  }

  return (
    <>
      <PageHeader
        icon={BookMarked}
        eyebrow="Get started"
        title="Let's plan your trip"
        subtitle="Tell us a bit about what you're looking for and we'll put together a starting itinerary."
      />
      <section className="mx-auto max-w-xl px-6 pb-24 lg:px-10">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Destination
            </label>
            <input
              type="text"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Travel style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TRIP_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                    style === s.id
                      ? 'border-(--border-mid) bg-(--surface-card-hover) text-(--text-primary)'
                      : 'border-(--border-soft) text-(--text-secondary) hover:border-(--border-mid)'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button
            type="submit"
            className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01]"
          >
            Generate my itinerary
          </button>
        </form>

        <ItineraryResult itinerary={itinerary} />
      </section>
    </>
  );
}
