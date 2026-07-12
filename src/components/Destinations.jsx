import { Link } from 'react-router-dom';
import { destinations } from '../data/destinations';
import DestinationCard from './DestinationCard';

const FEATURED_SLUGS = ['paris', 'tokyo', 'dubai', 'sydney', 'new-york', 'rio-de-janeiro'];
const featured = FEATURED_SLUGS.map((slug) => destinations.find((d) => d.slug === slug)).filter(
  Boolean
);

export default function Destinations() {
  return (
    <section className="relative border-t border-(--border-soft) bg-(--surface-strong) px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">
              Where to next
            </p>
            <h2 className="font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
              Popular <span className="text-gradient">Destinations</span>
            </h2>
            <p className="mt-4 text-(--text-secondary)">
              Six of the spots travelers on Voyora are searching for right now — plus{' '}
              {destinations.length - featured.length} more countries to explore.
            </p>
          </div>
          <Link
            to="/destinations"
            className="shrink-0 rounded-full border border-(--glass-border) px-5 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid)"
          >
            View all destinations &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
