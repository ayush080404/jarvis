import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Explore', to: '/explore' },
      { label: 'Explore Countries', to: '/explore-countries' },
      { label: 'Destinations', to: '/destinations' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Trip Planner', to: '/trip-planner' },
      { label: 'Plan My Trip', to: '/plan-my-trip' },
      { label: 'AI Guide', to: '/ai-guide' },
    ],
  },
  {
    title: 'Learn',
    links: [{ label: 'Travel Blog', to: '/travel-blog' }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--border-soft) bg-(--surface-strong) px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
                <Globe2 size={14} className="text-white" />
              </span>
              <span className="font-display text-sm font-semibold text-(--text-primary)">
                Voyora
              </span>
            </Link>
            <p className="mt-3 max-w-[20ch] text-sm text-(--text-secondary)">
              Your smart travel companion.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
                {col.title}
              </p>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-(--text-secondary) transition-colors hover:text-(--text-primary)"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-(--border-soft) pt-6 sm:flex-row">
          <p className="text-sm text-(--text-secondary)">
            &copy; {new Date().getFullYear()} Voyora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
