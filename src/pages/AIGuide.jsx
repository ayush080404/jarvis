import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  MapPin,
  Stamp,
  Utensils,
  Clock,
  Plane,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

const SUGGESTIONS = [
  'What should I pack for Egypt in July?',
  'Best time to visit Japan for cherry blossoms',
  'Do I need a visa for Vietnam?',
  'Where should I eat in Mexico City?',
];

const CAPABILITIES = [
  {
    icon: MapPin,
    title: 'Itinerary tips',
    desc: 'Get suggestions on how to structure your days based on Voyora\u2019s destination guides.',
  },
  {
    icon: Stamp,
    title: 'Visa & packing',
    desc: 'Quick answers on entry requirements, best travel seasons, and what to bring.',
  },
  {
    icon: Utensils,
    title: 'Local food picks',
    desc: 'Ask what to eat, and get real dishes pulled from each destination\u2019s must-try list.',
  },
];

export default function AIGuide() {
  usePageTitle('AI Guide');
  const [input, setInput] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    // AI Guide's real logic isn't wired up yet — this is a UI-only preview
    // for now, so sending just surfaces an honest "coming soon" instead of
    // silently doing nothing or faking a response.
    setShowComingSoon(true);
    window.setTimeout(() => setShowComingSoon(false), 3200);
  }

  return (
    <>
      <PageHeader
        icon={Sparkles}
        eyebrow="AI Guide"
        title="Your personal travel assistant"
        subtitle="Ask about visas, packing, itineraries, or where to eat — get answers built from real traveler guides."
        images={[
          '/images/paris.jpg',
          '/images/fuji_cherry_blossoms.jpg',
          '/images/marrakech_jemaa_el_fnaa_dusk.jpg',
          '/images/marina_bay_sands_night.jpg',
        ]}
      />

      <section className="mx-auto max-w-2xl px-6 pb-24 lg:px-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-(--border-soft) bg-(--surface-card) px-3 py-1 text-xs font-medium text-(--text-secondary)">
          <Sparkles size={12} className="text-sky-400" />
          Preview &mdash; full AI answers are coming soon
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-(--border-soft) bg-(--surface-card)">
          <div className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
                <Sparkles size={16} className="text-white" />
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-(--surface-card-hover) px-4 py-3 text-sm text-(--text-primary)">
                Hi! Tell me where you're headed and I'll help you plan the details.
              </div>
            </div>

            {showComingSoon && (
              <div className="page-transition flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
                  <Sparkles size={16} className="text-white" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-(--surface-card-hover) px-4 py-3 text-sm text-(--text-primary)">
                  I'm still being built — real answers are coming soon! In the meantime, try{' '}
                  <span className="font-medium">Trip Planner</span> or browse{' '}
                  <span className="font-medium">Destinations</span> for real guides.
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-(--border-soft) p-4">
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="rounded-full border border-(--border-soft) px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary)"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="mt-4 flex items-center gap-2 rounded-2xl border border-(--border-soft) bg-(--input-bg) p-2 pl-4 transition-colors focus-within:border-(--border-mid)">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. What should I pack for Tokyo in November?"
                className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                className="btn-gradient grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white transition-transform hover:scale-105"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-sky-400" />
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              What AI Guide will help with
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5"
              >
                <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                  <Icon size={16} />
                </span>
                <p className="text-sm font-semibold text-(--text-primary)">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
          <Plane size={18} className="mt-0.5 shrink-0 text-sky-400" />
          <p className="text-sm text-(--text-secondary)">
            In the meantime,{' '}
            <Link to="/trip-planner" className="font-medium text-(--text-primary) underline-offset-4 hover:underline">
              Trip Planner
            </Link>{' '}
            already builds a real starter itinerary from Voyora's destination guides.
          </p>
        </div>
      </section>
    </>
  );
}
