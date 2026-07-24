import { Link } from 'react-router-dom';
import { CalendarRange, Sparkles, Wallet, PenLine, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: CalendarRange,
    title: 'Trip Planner',
    desc: 'Chain up to 3 destinations into one itinerary, built around your dates and pace.',
    to: '/trip-planner',
    cta: 'Plan a trip',
  },
  {
    icon: Sparkles,
    title: 'AI Guide',
    desc: 'Ask about visas, packing, or where to eat, and get real answers instantly.',
    to: '/ai-guide',
    cta: 'Ask a question',
  },
  {
    icon: Wallet,
    title: 'Budget Estimator',
    desc: "See a rough cost breakdown before you book, so there's no surprise later.",
    to: '/budget-estimator',
    cta: 'Estimate a trip',
  },
  {
    icon: PenLine,
    title: 'Travel Blog',
    desc: 'City guides from Voyora, and real stories from travelers who\u2019ve been there.',
    to: '/travel-blog',
    cta: 'Read stories',
  },
];

export default function FeatureShowcase() {
  return (
    <section className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">
            More than a guide
          </p>
          <h2 className="font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
            Everything you need to <span className="text-gradient">actually plan the trip</span>
          </h2>
          <p className="mt-4 text-(--text-secondary)">
            Not just where to go — how to get there, what it'll cost, and what to ask along the
            way.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc, to, cta }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-(--text-primary)">
                {title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm text-(--text-secondary)">{desc}</p>
              <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-sky-500">
                {cta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
