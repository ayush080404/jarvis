import { Link, useParams, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Coins, CheckCircle2, ArrowLeft } from 'lucide-react';
import { getDestinationBySlug } from '../data/destinations';

export default function DestinationDetail() {
  const { slug } = useParams();
  const destination = getDestinationBySlug(slug);

  if (!destination) return <Navigate to="/destinations" replace />;

  const {
    name,
    country,
    tag,
    description,
    highlights,
    placesToVisit,
    bestTime,
    currency,
    heroImage,
    accentColor,
    gallery,
  } = destination;

  return (
    <div className="relative">
      {/* Hero: a blurred, scaled-up copy of the photo fills the whole banner
          for atmosphere, while the sharp copy uses object-contain so the
          actual subject (e.g. the Eiffel Tower) is never cropped out —
          object-cover on a tall photo inside a short wide banner was cutting
          most of the tower off. Falls back to a themed gradient when there's
          no photo at all. */}
      <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden bg-(--surface)">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
            />
            <img
              src={heroImage}
              alt={name}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 100% at 20% 0%, ${accentColor}55, transparent 60%), linear-gradient(160deg, ${accentColor}30, var(--surface) 70%)`,
            }}
          />
        )}

        {/* Overlay only darkens the lower third, so the subject stays clearly
            visible instead of washing out under a full-height gradient. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, var(--surface) 0%, rgba(0,0,0,0.35) 28%, transparent 55%)',
          }}
        />

        <div className="absolute inset-x-0 top-0 px-6 pt-28 lg:px-10 lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to destinations
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex items-center gap-2 text-white/90">
              <MapPin size={16} />
              <span className="text-xs font-medium uppercase tracking-widest">{country}</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {name}
            </h1>
            <p className="mt-2 font-display text-lg font-semibold" style={{ color: accentColor }}>
              {tag}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-10 lg:px-10">
        <p className="max-w-2xl text-(--text-secondary)">{description}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
            <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <Calendar size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                Best time to visit
              </span>
            </div>
            <p className="text-(--text-primary)">{bestTime}</p>
          </div>
          <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
            <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <Coins size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                Currency
              </span>
            </div>
            <p className="text-(--text-primary)">{currency}</p>
          </div>
        </div>

        {/* Rich, per-place breakdown when a destination has one (currently
            Paris/France) — falls back to the short "Don't miss" bullet list
            for every other destination. */}
        {placesToVisit && placesToVisit.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-(--text-primary)">
              Places to visit in {country}
            </h2>
            <p className="mt-1.5 text-sm text-(--text-secondary)">
              {placesToVisit.length} spots worth building a trip around.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {placesToVisit.map((place, i) => (
                <div
                  key={place.name}
                  className="overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-card)"
                >
                  {place.image && (
                    <div className="h-36 w-full overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-display text-base font-semibold text-(--text-primary)">
                        {place.name}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {place.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-(--text-secondary)"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0"
                            style={{ color: accentColor }}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-(--text-primary)">
              Don&apos;t miss
            </h2>
            <ul className="mt-4 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-(--text-secondary)">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {gallery && gallery.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold text-(--text-primary)">
              More of {name}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src) => (
                <div key={src} className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          to="/plan-my-trip"
          className="btn-gradient mt-10 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02]"
        >
          Plan a trip to {name}
        </Link>
      </div>
    </div>
  );
}
