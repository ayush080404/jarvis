import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search as SearchIcon, X } from 'lucide-react';
import { destinations } from '../data/destinations';

function getMatches(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return destinations
    .filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
    )
    .slice(0, 6);
}

export default function SearchBox({
  variant = 'hero',
  placeholder = 'Search any country, city or destination...',
  autoFocus = false,
  onNavigate,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const matches = useMemo(() => getMatches(query), [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  function goTo(slug) {
    setOpen(false);
    setQuery('');
    navigate(`/destinations/${slug}`);
    onNavigate?.();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (matches.length > 0) {
      goTo(matches[activeIndex >= 0 ? activeIndex : 0].slug);
    } else if (query.trim()) {
      navigate('/destinations');
      setOpen(false);
      onNavigate?.();
    }
  }

  function handleKeyDown(e) {
    if (!open || matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={
          isHero
            ? 'flex items-center gap-2 rounded-2xl border border-(--border-soft) bg-(--input-bg) p-2 pl-4 backdrop-blur-sm'
            : 'flex items-center gap-2 rounded-full border border-(--glass-border) bg-(--glass-b) p-1.5 pl-3.5 backdrop-blur-sm'
        }
      >
        <SearchIcon size={isHero ? 18 : 15} className="shrink-0 text-(--text-secondary)" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-(--text-secondary) hover:text-(--text-primary)"
          >
            <X size={13} />
          </button>
        )}
        {isHero && (
          <button
            type="submit"
            aria-label="Search"
            className="btn-gradient grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
          >
            <SearchIcon size={16} />
          </button>
        )}
      </form>

      {open && query.trim() && (
        <div className="liquid-glass absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl p-2">
          {matches.length > 0 ? (
            <ul>
              {matches.map((d, i) => (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(d.slug)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      activeIndex === i ? 'bg-(--surface-card-hover)' : ''
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                      <MapPin size={14} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-(--text-primary)">
                        {d.name}
                      </span>
                      <span className="block text-xs text-(--text-secondary)">
                        {d.country} &middot; {d.tag}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-center text-sm text-(--text-secondary)">
              No matches yet — try a city or country name.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
