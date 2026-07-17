import { Link } from 'react-router-dom';
import { Compass, Mountain, Utensils, Landmark, Waves } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DestinationQuiz from '../components/DestinationQuiz';
import { destinations } from '../data/destinations';
import { usePageTitle } from '../hooks/usePageTitle';

const categories = [
  {
    theme: 'beaches',
    icon: Waves,
    title: 'Beaches & Islands',
    desc: 'Coastlines, coral reefs, and island-hopping worth packing a swimsuit for.',
  },
  {
    theme: 'mountains',
    icon: Mountain,
    title: 'Mountains & Adventure',
    desc: 'Alpine towns, desert safaris, and landscapes built for getting outside.',
  },
  {
    theme: 'culture',
    icon: Landmark,
    title: 'Culture & History',
    desc: 'Museums, monuments, and stories behind every city.',
  },
  {
    theme: 'food-nightlife',
    icon: Utensils,
    title: 'Food & Nightlife',
    desc: 'Where locals actually eat, drink, and unwind.',
  },
];

function destinationsFor(theme) {
  return destinations.filter((d) => d.themes?.includes(theme));
}

export default function Explore() {
  usePageTitle('Explore');
  return (
    <>
      <PageHeader
        icon={Compass}
        eyebrow="Discover"
        title="Explore the world, by theme"
        subtitle="Browse destinations by what you're actually in the mood for — not just a map pin."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <DestinationQuiz />

        <h2 className="mb-5 mt-12 font-display text-lg font-semibold text-(--text-primary)">
          Or browse by theme
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categories.map(({ theme, icon: Icon, title, desc }) => {
            const matches = destinationsFor(theme);
            const preview = matches.slice(0, 3);
            return (
              <Link
                key={title}
                to={`/destinations?theme=${theme}`}
                className="group rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                      <Icon size={18} />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-(--text-secondary)">{desc}</p>
                  </div>

                  {preview.length > 0 && (
                    <div className="flex shrink-0 -space-x-3">
                      {preview.map((d) =>
                        d.heroImage ? (
                          <img
                            key={d.slug}
                            src={d.heroImage}
                            alt={d.name}
                            loading="lazy"
                            className="h-12 w-12 rounded-full border-2 border-(--surface-card) object-cover"
                          />
                        ) : (
                          <span
                            key={d.slug}
                            className="grid h-12 w-12 place-items-center rounded-full border-2 border-(--surface-card) text-xs font-bold"
                            style={{ backgroundColor: `${d.accentColor}40`, color: d.accentColor }}
                          >
                            {d.name.slice(0, 1)}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                  {matches.length} destination{matches.length === 1 ? '' : 's'} &rarr;
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
