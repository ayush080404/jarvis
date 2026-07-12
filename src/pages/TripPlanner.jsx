import { CalendarRange, MapPin, Wallet } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const steps = [
  { icon: MapPin, title: 'Pick your destinations', desc: 'Add one city or string together a multi-stop route.' },
  { icon: CalendarRange, title: 'Set your dates', desc: 'We\u2019ll flag weather, local holidays, and peak season pricing.' },
  { icon: Wallet, title: 'Set a budget', desc: 'Get a day-by-day plan that keeps you within range.' },
];

export default function TripPlanner() {
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
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6"
            >
              <span className="absolute right-5 top-5 font-display text-3xl font-bold text-(--border-mid)">
                0{i + 1}
              </span>
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                <Icon size={18} />
              </span>
              <h3 className="font-display text-lg font-semibold text-(--text-primary)">{title}</h3>
              <p className="mt-2 text-sm text-(--text-secondary)">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
