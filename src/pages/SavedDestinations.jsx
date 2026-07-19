import { useEffect, useState } from 'react';
import { Bookmark, Compass, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import { destinations } from '../data/destinations';
import { getSavedSlugs, removeSaved, onSavedChange } from '../utils/saved';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SavedDestinations() {
  usePageTitle('Saved');
  const [slugs, setSlugs] = useState(() => getSavedSlugs());

  useEffect(() => {
    const unsubscribe = onSavedChange(() => setSlugs(getSavedSlugs()));
    return unsubscribe;
  }, []);

  const saved = slugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter(Boolean);

  // Personal touch: once someone has saved destinations, show their actual
  // photos in the header instead of a generic set — falls back to a
  // curated default while the list is still empty.
  const fallbackImages = [
    '/images/paris.jpg',
    '/images/fuji_cherry_blossoms.jpg',
    '/images/pyramids_of_giza.jpg',
    '/images/santorini_blue_domes.jpg',
  ];
  const headerImages =
    saved.length > 0 ? saved.slice(0, 4).map((d) => d.heroImage) : fallbackImages;

  return (
    <>
      <PageHeader
        icon={Bookmark}
        eyebrow={`${saved.length} saved`}
        title="Your saved destinations"
        subtitle="Everything you've bookmarked, kept in this browser so you can pick up planning anytime."
        images={headerImages}
      />
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        {saved.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((d, i) => (
              <div key={d.slug} className="relative">
                <button
                  onClick={() => removeSaved(d.slug)}
                  aria-label={`Remove ${d.name} from saved`}
                  className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
                >
                  <X size={14} />
                </button>
                <DestinationCard destination={d} priority={i < 6} isLCP={i === 0} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="Nothing saved yet."
            description="Tap the bookmark icon on any destination page to keep it here."
            actionLabel="Browse destinations"
            actionTo="/destinations"
          />
        )}
      </section>
    </>
  );
}
