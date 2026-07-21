import { useEffect, useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trash2, PenLine } from 'lucide-react';
import { getPostBySlug } from '../data/blogPosts';
import { getCommunityPostBySlug, removeCommunityPost } from '../utils/communityPosts';
import { getCurrentUser } from '../utils/auth';
import ShareButton from '../components/ShareButton';
import PageLoader from '../components/PageLoader';
import { usePageTitle } from '../hooks/usePageTitle';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const officialPost = getPostBySlug(slug);

  const [communityPost, setCommunityPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(Boolean(officialPost));

  useEffect(() => {
    if (officialPost) return;
    let cancelled = false;
    Promise.all([getCommunityPostBySlug(slug), getCurrentUser()]).then(([post, currentUser]) => {
      if (cancelled) return;
      setCommunityPost(post);
      setUser(currentUser);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, officialPost]);

  const post = officialPost || communityPost;
  usePageTitle(post?.title);

  if (!loaded) return <PageLoader />;
  if (!post) return <Navigate to="/travel-blog" replace />;

  const isCommunity = Boolean(communityPost);
  const isOwner = isCommunity && user && post.userId === user.id;

  async function handleDelete() {
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    await removeCommunityPost(slug);
    navigate('/travel-blog');
  }

  return (
    <div>
      {post.coverImage && (
        <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden">
          <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to top, var(--surface) 0%, transparent 60%)',
            }}
          />
        </div>
      )}

      <section className={`mx-auto max-w-2xl px-6 pb-24 lg:px-10 ${post.coverImage ? 'pt-10' : 'pt-32 lg:pt-40'}`}>
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/travel-blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
          >
            <ArrowLeft size={15} />
            Back to Travel Blog
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton title={post.title} />
            {isOwner && (
              <>
                <Link
                  to={`/travel-blog/write?edit=${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--border-soft) px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary)"
                >
                  <PenLine size={13} />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--border-soft) px-3 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:border-rose-500/50 hover:bg-rose-500/10"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {isCommunity ? (
          <p className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-sky-500">
            <Users size={12} />
            Community story
          </p>
        ) : (
          <p className="mt-8 text-xs font-medium uppercase tracking-widest text-sky-500">
            {post.tag}
          </p>
        )}

        <h1 className="mt-2 font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-(--text-secondary)">
          {isCommunity
            ? `By ${post.author}${post.destinationName ? ` \u00b7 ${post.destinationName}` : ''}`
            : post.readTime}
        </p>

        <div className="mt-8 space-y-7">
          {Array.isArray(post.body) ? (
            post.body.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                  {section.heading}
                </h2>
                <p className="mt-2.5 leading-relaxed text-(--text-secondary)">{section.text}</p>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {post.body.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="leading-relaxed text-(--text-secondary)">
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
