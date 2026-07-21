import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, PenLine, Users, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import blogPosts from '../data/blogPosts';
import { getCommunityPosts, onCommunityPostsChange, removeCommunityPost } from '../utils/communityPosts';
import { getCurrentUser, onAuthChange } from '../utils/auth';
import { usePageTitle } from '../hooks/usePageTitle';

export default function TravelBlog() {
  usePageTitle('Travel Blog');
  const [communityPosts, setCommunityPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthChange((currentUser) => setUser(currentUser));
    return unsubAuth;
  }, []);

  // Community posts now live in Supabase and are visible to everyone, so
  // refresh whenever anyone (on any device) adds, edits, or deletes one.
  useEffect(() => {
    function refresh() {
      getCommunityPosts().then(setCommunityPosts);
    }
    refresh();
    const unsubscribe = onCommunityPostsChange(refresh);
    return unsubscribe;
  }, []);

  const allPosts = [...communityPosts, ...blogPosts];

  return (
    <>
      <PageHeader
        icon={Newspaper}
        eyebrow="Read"
        title="Stories from the road"
        subtitle="Guides from Voyora, and real trips from travelers like you."
        images={[
          '/images/lisbon_tram_28.jpg',
          '/images/ha_long_bay_aerial.jpg',
          '/images/santorini_blue_domes.jpg',
          '/images/victoria_peak_skyline.jpg',
        ]}
      />

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
              <PenLine size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-(--text-primary)">Been somewhere recently?</p>
              <p className="text-sm text-(--text-secondary)">
                Share your own trip and it'll show up right here.
              </p>
            </div>
          </div>
          <Link
            to="/travel-blog/write"
            className="btn-gradient inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform hover:scale-[1.02]"
          >
            Write your story
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <div key={post.slug} className="relative">
              {post.isCommunity && user && post.userId === user.id && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (window.confirm('Delete this story? This can\'t be undone.')) {
                      await removeCommunityPost(post.slug);
                    }
                  }}
                  aria-label="Delete story"
                  className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition-colors hover:bg-rose-500/70"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <Link
                to={`/travel-blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-card) transition-colors hover:border-(--border-mid)"
              >
                <div className="relative h-44 w-full overflow-hidden bg-(--surface-card-hover)">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                      <PenLine size={28} className="text-sky-400/60" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
                    {post.isCommunity ? (
                      <>
                        <Users size={11} />
                        Community
                      </>
                    ) : (
                      post.tag
                    )}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-(--text-primary)">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-(--text-secondary)">
                    {post.isCommunity ? post.body : post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-(--text-secondary)">
                      {post.isCommunity ? `By ${post.author}` : post.readTime}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                      Read
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
