import { Link } from 'react-router-dom';
import { Mic, Compass, BookMarked, MapPinned, Globe } from 'lucide-react';
import Globe3D from './Globe3D';
import MountainsSilhouette from './MountainsSilhouette';
import SearchBox from './SearchBox';
import { destinations } from '../data/destinations';

const regionCount = new Set(destinations.map((d) => d.country)).size;
const spotCount = destinations.reduce(
  (sum, d) => sum + (d.placesToVisit?.length || d.highlights?.length || 0),
  0
);

// Real counts derived from the destination data, not placeholder marketing
// numbers — these update automatically as more destinations/places are added.
const stats = [
  { icon: Globe, value: `${destinations.length}`, label: 'Destinations' },
  { icon: MapPinned, value: `${spotCount}+`, label: 'Places to Explore' },
  { icon: BookMarked, value: `${regionCount}`, label: 'Regions Covered' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="starfield" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl transition-opacity duration-500"
        style={{ opacity: 'var(--hero-glow-opacity)' }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-28 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:pt-36">
        {/* Left column */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--glass-border) bg-(--glass-b) px-4 py-1.5 text-sm backdrop-blur">
            <Globe size={14} className="text-sky-400" />
            <span className="text-(--text-secondary)">Your Smart Travel Companion</span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-(--text-primary) sm:text-6xl">
            Explore
            <br />
            <span className="text-gradient">Beyond Borders</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-(--text-secondary)">
            Discover hidden gems, visa guides, local culture, travel tips, and
            AI-powered itineraries.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <SearchBox variant="hero" />
            <button
              type="button"
              aria-label="Voice search"
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border border-(--border-soft) bg-(--input-bg) text-(--text-secondary) transition-colors hover:text-(--text-primary)"
            >
              <Mic size={16} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/explore-countries"
              className="btn-gradient flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02]"
            >
              <Compass size={16} />
              Explore Countries
            </Link>
            <Link
              to="/trip-planner"
              className="flex items-center gap-2 rounded-xl border border-(--glass-border) px-6 py-3.5 text-sm font-semibold text-(--text-primary) transition-colors hover:border-(--border-mid)"
            >
              <BookMarked size={16} />
              Plan My Trip
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-(--text-primary)">
                    {value}
                  </p>
                  <p className="text-xs text-(--text-secondary)">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: real 3D globe */}
        <div className="relative z-10 mx-auto aspect-square w-full max-w-[560px]">
          <Globe3D />
        </div>
      </div>

      <MountainsSilhouette />

      <div className="relative z-10 mx-auto flex max-w-7xl justify-start px-6 pb-6 text-xs text-(--text-secondary) lg:px-10">
        <div className="flex flex-col items-center gap-1">
          <span className="grid h-9 w-6 place-items-start rounded-full border border-(--border-mid) p-1">
            <span className="h-1.5 w-1 rounded-full bg-(--text-secondary)" />
          </span>
          Scroll to Explore
        </div>
      </div>
    </section>
  );
}
