import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Coins,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  UtensilsCrossed,
  Languages,
  Plane,
  Stamp,
  CalendarRange,
  Bookmark,
  BookmarkCheck,
  Map as MapIcon,
} from 'lucide-react';
import { destinations, getDestinationBySlug } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import ShareButton from '../components/ShareButton';
import PackingChecklist from '../components/PackingChecklist';
import { isSaved, toggleSaved } from '../utils/saved';
import { usePageTitle } from '../hooks/usePageTitle';

export default function DestinationDetail() {
  const { slug } = useParams();
  const destination = getDestinationBySlug(slug);
  usePageTitle(destination?.name);

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!slug) return;
    setSaved(isSaved(slug));
  }, [slug]);

  const navItems = useMemo(() => {
    if (!destination) return [];
    const items = [{ id: 'overview', label: 'Overview' }];
    if (destination.placesToVisit?.length > 0 || destination.highlights?.length > 0) {
      items.push({ id: 'places', label: 'Places' });
    }
    if (destination.lat != null && destination.lng != null) {
      items.push({ id: 'map', label: 'Map' });
    }
    if (destination.mustTryExperiences?.length > 0) {
      items.push({ id: 'experiences', label: 'Experiences' });
    }
    if (destination.mustTryFood?.length > 0) {
      items.push({ id: 'food', label: 'Food' });
    }
    items.push({ id: 'packing', label: 'Packing' });
    if (destination.gallery?.length > 0) {
      items.push({ id: 'gallery', label: 'Gallery' });
    }
    return items;
  }, [destination]);

  useEffect(() => {
    if (navItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: 0 }
    );
    navItems.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navItems]);

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
    mustTryExperiences,
    mustTryFood,
    idealStay,
    language,
    nearestAirport,
    visaNote,
    lat,
    lng,
  } = destination;

  function registerSection(id) {
    return (el) => {
      sectionRefs.current[id] = el;
    };
  }

  function scrollToSection(id) {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleToggleSaved() {
    setSaved(toggleSaved(slug));
  }



  const related = destinations
    .filter((d) => d.slug !== slug && d.country === country)
    .slice(0, 3);
  const relatedFinal =
    related.length >= 3
      ? related
      : [
          ...related,
          ...destinations
            .filter((d) => d.slug !== slug && !related.includes(d))
            .slice(0, 3 - related.length),
        ];

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

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-28 lg:px-10 lg:pt-32">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to destinations
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSaved}
                aria-label={saved ? 'Remove from saved' : 'Save destination'}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/35"
              >
                {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
              <ShareButton
                title={name}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/35"
              />
            </div>
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

      {/* Sticky mini nav: lets people jump straight to Places, Map,
          Experiences, Food, or Gallery instead of scrolling through
          everything in between. */}
      {navItems.length > 1 && (
        <div className="sticky top-20 z-40 w-full border-b border-(--border-soft) bg-(--surface)/85 backdrop-blur-md sm:top-24">
          <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-6 py-2.5 lg:px-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
                style={activeSection === item.id ? { backgroundColor: accentColor } : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-10 lg:px-10">
        <div ref={registerSection('overview')} className="scroll-mt-32">
          <p className="max-w-2xl text-(--text-secondary)">{description}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
              <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                <Calendar size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                  Best time
                </span>
              </div>
              <p className="text-sm text-(--text-primary)">{bestTime}</p>
            </div>
            <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
              <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                <Coins size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                  Currency
                </span>
              </div>
              <p className="text-sm text-(--text-primary)">{currency}</p>
            </div>
            {idealStay && (
              <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
                <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                  <CalendarRange size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                    Ideal stay
                  </span>
                </div>
                <p className="text-sm text-(--text-primary)">{idealStay}</p>
              </div>
            )}
            {language && (
              <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
                <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                  <Languages size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                    Language
                  </span>
                </div>
                <p className="text-sm text-(--text-primary)">{language}</p>
              </div>
            )}
          </div>

          {(nearestAirport || visaNote) && (
            <div className="mt-4 rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nearestAirport && (
                  <div>
                    <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                      <Plane size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                        Nearest airport
                      </span>
                    </div>
                    <p className="text-sm text-(--text-primary)">{nearestAirport}</p>
                  </div>
                )}
                {visaNote && (
                  <div>
                    <div className="mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                      <Stamp size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
                        Visa
                      </span>
                    </div>
                    <p className="text-sm text-(--text-primary)">{visaNote}</p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-(--text-secondary)">
                Visa and entry rules depend on your nationality — always confirm with an official
                source before booking.
              </p>
            </div>
          )}
        </div>

        {/* Rich, per-place breakdown when a destination has one (currently
            Paris/France) — falls back to the short "Don't miss" bullet list
            for every other destination. */}
        {placesToVisit && placesToVisit.length > 0 ? (
          <div ref={registerSection('places')} className="mt-10 scroll-mt-32">
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
          highlights &&
          highlights.length > 0 && (
            <div ref={registerSection('places')} className="mt-8 scroll-mt-32">
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
          )
        )}

        {lat != null && lng != null && (
          <div ref={registerSection('map')} className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-2">
              <MapIcon size={18} style={{ color: accentColor }} />
              <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                Map
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-(--text-secondary)">
              Centered on {name} — use it alongside the places above to get a feel for the area.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-(--border-soft)">
              <iframe
                title={`Map of ${name}`}
                className="h-80 w-full"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.4}%2C${
                  lat - 0.25
                }%2C${lng + 0.4}%2C${lat + 0.25}&layer=mapnik&marker=${lat}%2C${lng}`}
              />
            </div>
          </div>
        )}

        {mustTryExperiences && mustTryExperiences.length > 0 && (
          <div ref={registerSection('experiences')} className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-2">
              <Sparkles size={18} style={{ color: accentColor }} />
              <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                Must-try experiences
              </h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {mustTryExperiences.map((exp) => (
                <div
                  key={exp}
                  className="flex items-start gap-3 rounded-xl border border-(--border-soft) bg-(--surface-card) p-4"
                >
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: `${accentColor}25` }}
                  >
                    <Sparkles size={12} style={{ color: accentColor }} />
                  </span>
                  <span className="text-sm text-(--text-secondary)">{exp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mustTryFood && mustTryFood.length > 0 && (
          <div ref={registerSection('food')} className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} style={{ color: accentColor }} />
              <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                Must-try food
              </h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {mustTryFood.map((food) => (
                <span
                  key={food}
                  className="rounded-full border border-(--border-soft) bg-(--surface-card) px-4 py-2 text-sm font-medium text-(--text-primary) transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${accentColor}20`)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}

        <div ref={registerSection('packing')} className="mt-10 scroll-mt-32">
          <PackingChecklist destination={destination} />
        </div>

        {gallery && gallery.length > 0 && (
          <div ref={registerSection('gallery')} className="mt-10 scroll-mt-32">
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

        {relatedFinal.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-lg font-semibold text-(--text-primary)">
              You might also like
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFinal.map((d) => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/trip-planner?destination=${slug}`}
          className="btn-gradient mt-10 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02]"
        >
          Plan a trip to {name}
        </Link>
      </div>
    </div>
  );
}
