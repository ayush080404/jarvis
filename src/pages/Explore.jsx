import { Compass, Mountain, Utensils, Landmark } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const categories = [
  { icon: Landmark, title: 'Culture & History', desc: 'Museums, monuments, and stories behind every city.' },
  { icon: Mountain, title: 'Nature & Adventure', desc: 'Hikes, coastlines, and wild places worth the detour.' },
  { icon: Utensils, title: 'Food & Nightlife', desc: 'Where locals actually eat, drink, and unwind.' },
];

export default function Explore() {
  return (
    <>
      <PageHeader
        icon={Compass}
        eyebrow="Discover"
        title="Explore the world, by theme"
        subtitle="Browse destinations by what you're actually in the mood for — not just a map pin."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid)"
            >
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
