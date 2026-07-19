import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Layers } from 'lucide-react';

export default function DestinationCard({ destination, priority = false, isLCP = false }) {
  const { slug, name, country, tag, heroImage, accentColor, placesToVisit, bestTime } = destination;
  const [loaded, setLoaded] = useState(false);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  }

  return (
    <Link
      to={`/destinations/${slug}`}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-card) transition-colors hover:border-(--border-mid) hover:bg-(--surface-card-hover)"
    >
      {/* Cursor-reactive glow — tracks the mouse via --mx/--my set on
          mousemove above, only visible on hover (opacity 0 -> 1). */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), ${accentColor}22, transparent 70%)`,
        }}
      />

      <div className="relative h-36 w-full overflow-hidden">
        {heroImage ? (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}15)` }}
            />
            <img
              src={heroImage}
              alt={name}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={isLCP ? 'high' : 'auto'}
              onLoad={() => setLoaded(true)}
              className={`relative h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}15)`,
            }}
          >
            <span
              className="font-display text-3xl font-bold opacity-70"
              style={{ color: accentColor }}
            >
              {name.slice(0, 1)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center gap-2" style={{ color: accentColor }}>
          <MapPin size={16} />
          <span className="text-xs font-medium uppercase tracking-wide">{country}</span>
        </div>
        <h3 className="font-display text-xl font-semibold text-(--text-primary)">{name}</h3>
        <p className="mt-1 text-sm text-(--text-secondary)">{tag}</p>

        {(placesToVisit?.length > 0 || bestTime) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {placesToVisit?.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-(--border-soft) px-2.5 py-1 text-[11px] font-medium text-(--text-secondary)">
                <Layers size={11} />
                {placesToVisit.length} spots
              </span>
            )}
            {bestTime && (
              <span
                title={bestTime}
                className="inline-flex max-w-[13rem] items-center gap-1 truncate rounded-full border border-(--border-soft) px-2.5 py-1 text-[11px] font-medium text-(--text-secondary)"
              >
                <Calendar size={11} className="shrink-0" />
                <span className="truncate">{bestTime}</span>
              </span>
            )}
          </div>
        )}

        <span className="mt-5 inline-block text-sm font-medium text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
          View guide &rarr;
        </span>
      </div>
    </Link>
  );
}
