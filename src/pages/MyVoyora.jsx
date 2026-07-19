import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCircle,
  LogOut,
  Bookmark,
  PenLine,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import { destinations } from '../data/destinations';
import { getCurrentUser, logout, onAuthChange } from '../utils/auth';
import { getSavedSlugs, onSavedChange } from '../utils/saved';
import { getCommunityPosts, onCommunityPostsChange, removeCommunityPost } from '../utils/communityPosts';
import { usePageTitle } from '../hooks/usePageTitle';

export default function MyVoyora() {
  usePageTitle('My Voyora');

  const [user, setUser] = useState(() => getCurrentUser());
  const [savedSlugs, setSavedSlugs] = useState(() => getSavedSlugs());
  const [posts, setPosts] = useState(() => getCommunityPosts());

  useEffect(() => {
    const unsub1 = onAuthChange(() => setUser(getCurrentUser()));
    const unsub2 = onSavedChange(() => setSavedSlugs(getSavedSlugs()));
    const unsub3 = onCommunityPostsChange(() => setPosts(getCommunityPosts()));
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  const savedDestinations = savedSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter(Boolean);

  function handleDeletePost(slug) {
    if (!window.confirm('Delete this story? This can\'t be undone.')) return;
    removeCommunityPost(slug);
  }

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        eyebrow="Your hub"
        title="My Voyora"
        subtitle="Your account, saved trips, and stories, all kept in this browser."
        images={[
          '/images/paris.jpg',
          '/images/fuji_cherry_blossoms.jpg',
          '/images/pyramids_of_giza.jpg',
          '/images/santorini_blue_domes.jpg',
        ]}
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        {/* Account */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-white">
              <UserCircle size={22} />
            </span>
            {user ? (
              <div>
                <p className="font-display text-base font-semibold text-(--text-primary)">
                  {user.name}
                </p>
                <p className="text-sm text-(--text-secondary)">{user.email}</p>
              </div>
            ) : (
              <div>
                <p className="font-display text-base font-semibold text-(--text-primary)">
                  Not logged in
                </p>
                <p className="text-sm text-(--text-secondary)">
                  Saved trips and stories below still work without an account.
                </p>
              </div>
            )}
          </div>
          {user ? (
            <button
              onClick={logout}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-(--border-soft) px-4 py-2 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid)"
            >
              <LogOut size={14} />
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="btn-gradient inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Saved trips */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bookmark size={18} className="text-sky-400" />
              <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                Your saved trips
              </h2>
            </div>
            {savedDestinations.length > 0 && (
              <Link
                to="/saved"
                className="inline-flex items-center gap-1 text-xs font-medium text-(--text-secondary) hover:text-(--text-primary)"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {savedDestinations.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedDestinations.slice(0, 3).map((d, i) => (
                <DestinationCard key={d.slug} destination={d} priority={i === 0} isLCP={i === 0} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={Bookmark}
                title="Nothing saved yet."
                description="Tap the bookmark icon on any destination page to keep it here."
                actionLabel="Browse destinations"
                actionTo="/destinations"
              />
            </div>
          )}
        </div>

        {/* Your stories */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PenLine size={18} className="text-sky-400" />
              <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                Your stories
              </h2>
            </div>
            <Link
              to="/travel-blog/write"
              className="inline-flex items-center gap-1 text-xs font-medium text-(--text-secondary) hover:text-(--text-primary)"
            >
              Write a new one
              <ArrowRight size={12} />
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="mt-4 space-y-2.5">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between gap-3 rounded-xl border border-(--border-soft) bg-(--surface-card) p-4"
                >
                  <Link to={`/travel-blog/${post.slug}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-(--text-primary)">
                      {post.title}
                    </p>
                    <p className="text-xs text-(--text-secondary)">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`/travel-blog/write?edit=${post.slug}`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-(--border-soft) text-(--text-secondary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary)"
                      aria-label="Edit story"
                    >
                      <PenLine size={13} />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.slug)}
                      className="grid h-8 w-8 place-items-center rounded-full border border-(--border-soft) text-rose-500 transition-colors hover:border-rose-500/50 hover:bg-rose-500/10"
                      aria-label="Delete story"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={PenLine}
                title="No stories yet."
                description="Written about a trip? Share it and it'll show up here."
                actionLabel="Write your story"
                actionTo="/travel-blog/write"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
