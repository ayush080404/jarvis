import { BookMarked } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function PlanMyTrip() {
  return (
    <>
      <PageHeader
        icon={BookMarked}
        eyebrow="Get started"
        title="Let's plan your trip"
        subtitle="Tell us a bit about what you're looking for and we'll put together a starting itinerary."
      />
      <section className="mx-auto max-w-xl px-6 pb-24 lg:px-10">
        <form className="space-y-4 rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Destination
            </label>
            <input
              type="text"
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
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                End date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Travel style
            </label>
            <input
              type="text"
              placeholder="Relaxed, packed, adventurous..."
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01]"
          >
            Generate my itinerary
          </button>
        </form>
      </section>
    </>
  );
}
