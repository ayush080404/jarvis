import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PenLine, Search, Check, X } from 'lucide-react';
import { destinations } from '../data/destinations';
import {
  addCommunityPost,
  updateCommunityPost,
  getCommunityPostBySlug,
} from '../utils/communityPosts';
import { usePageTitle } from '../hooks/usePageTitle';

export default function WriteBlogPost() {
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');
  const existingPost = editSlug ? getCommunityPostBySlug(editSlug) : null;
  const isEditing = Boolean(existingPost);

  usePageTitle(isEditing ? 'Edit Your Story' : 'Share Your Story');
  const navigate = useNavigate();

  const [title, setTitle] = useState(existingPost?.title || '');
  const [author, setAuthor] = useState(existingPost?.author || '');
  const [body, setBody] = useState(existingPost?.body || '');
  const [query, setQuery] = useState(existingPost?.destinationName || '');
  const [destSlug, setDestSlug] = useState(() => {
    if (!existingPost?.destinationName) return null;
    return destinations.find((d) => d.name === existingPost.destinationName)?.slug || null;
  });
  const [error, setError] = useState('');

  // If someone lands on ?edit=slug for a post that doesn't exist on this
  // device (wrong browser, already deleted, etc.), send them back rather
  // than showing a blank form pretending to edit something real.
  useEffect(() => {
    if (editSlug && !existingPost) {
      navigate('/travel-blog', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSlug]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return destinations.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const selectedDestination = destinations.find((d) => d.slug === destSlug) || null;

  function pickDestination(d) {
    setDestSlug(d.slug);
    setQuery(d.name);
  }

  function clearDestination() {
    setDestSlug(null);
    setQuery('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !author.trim() || !body.trim()) {
      setError('Fill in a title, your name, and your story before posting.');
      return;
    }
    if (body.trim().length < 40) {
      setError('Your story is a little short — tell us a bit more (at least a few sentences).');
      return;
    }

    if (isEditing) {
      const updated = updateCommunityPost(existingPost.slug, {
        title,
        author,
        body,
        coverImage: selectedDestination?.heroImage ?? null,
        destinationName: selectedDestination?.name ?? null,
      });
      navigate(`/travel-blog/${updated.slug}`);
      return;
    }

    const post = addCommunityPost({
      title,
      author,
      body,
      coverImage: selectedDestination?.heroImage || null,
      destinationName: selectedDestination?.name || null,
    });

    navigate(`/travel-blog/${post.slug}`);
  }

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-32 lg:px-10 lg:pt-40">
      <div className="flex items-center gap-2">
        <PenLine size={18} className="text-sky-400" />
        <p className="text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
          Community story
        </p>
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
        {isEditing ? 'Edit your story' : 'Share your travel story'}
      </h1>
      <p className="mt-3 text-(--text-secondary)">
        {isEditing
          ? 'Update your story below — changes save on this device.'
          : "Write about a trip you loved. Your story is saved on this device and shows up alongside Voyora's guides on the Travel Blog page."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Story title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Getting lost (on purpose) in Kyoto"
            className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Your name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Priya M."
            className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Destination <span className="font-normal text-(--text-secondary)">(optional — adds a cover photo)</span>
          </label>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDestSlug(null);
              }}
              placeholder="Search a destination..."
              className="w-full rounded-xl border border-(--border-soft) bg-(--input-bg) py-2.5 pl-9 pr-9 text-sm text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear destination"
                onClick={clearDestination}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-secondary) hover:text-(--text-primary)"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {matches.length > 0 && !destSlug && (
            <div className="mt-2 space-y-1 rounded-xl border border-(--border-soft) p-1.5">
              {matches.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => pickDestination(d)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-(--text-primary) transition-colors hover:bg-(--surface-card-hover)"
                >
                  {d.name} <span className="text-(--text-secondary)">&middot; {d.country}</span>
                </button>
              ))}
            </div>
          )}
          {selectedDestination && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <Check size={13} /> Cover photo from {selectedDestination.name} will be used
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Your story
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="What happened, what surprised you, what you'd tell a friend before they go..."
            className="w-full resize-y rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-3 text-sm leading-relaxed text-(--text-primary) placeholder:text-(--text-secondary) transition-colors focus:border-(--border-mid) focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] sm:w-auto"
        >
          {isEditing ? 'Save changes' : 'Post my story'}
        </button>
      </form>
    </section>
  );
}
