import { Link } from 'react-router-dom';
import { Compass, Mountain, Utensils, Landmark } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { destinations } from '../data/destinations';

const categories = [
  {
    theme: 'culture',
    icon: Landmark,
    title: 'Culture & History',
    desc: 'Museums, monuments, and stories behind every city.',
  },
  {
    theme: 'nature',
    icon: Mountain,
    title: 'Nature & Adventure',
    desc: 'Hikes, coastlines, and wild places worth the detour.',
  },
  {
    theme: 'food-nightlife',
    icon: Utensils,
    title: 'Food & Nightlife',
    desc: 'Where locals actually eat, drink, and unwind.',
  },
];

function countFor(theme) {
  return destinations.filter((d) => d.themes?.includes(theme)).length;
}

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
          {categories.map(({ theme, icon: Icon, title, desc }) => (
            <Link
              key={title}
              to={`/destinations?theme=${theme}`}
              className="group rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                <Icon size={18} />
              </span>
              <h3 className="font-display text-lg font-semibold text-(--text-primary)">{title}</h3>
              <p className="mt-2 text-sm text-(--text-secondary)">{desc}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                {countFor(theme)} destinations &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
