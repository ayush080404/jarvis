import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Newspaper, Compass, Search as SearchIcon, X } from 'lucide-react';
import { searchSite } from '../utils/search';

const TYPE_ICON = { destination: MapPin, blog: Newspaper, theme: Compass };
const TYPE_LABEL = { destination: 'Destinations', blog: 'From the blog', theme: 'Browse by theme' };

export default function SearchBox({
  variant = 'hero',
  placeholder = 'Search destinations, guides, themes...',
  autoFocus = false,
  onNavigate,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const matches = useMemo(() => searchSite(query), [query]);

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

  function goTo(to) {
    setOpen(false);
    setQuery('');
    navigate(to);
    onNavigate?.();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (matches.length > 0) {
      goTo(matches[activeIndex >= 0 ? activeIndex : 0].to);
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
        role="search"
        className={
          isHero
            ? 'flex items-center gap-2 rounded-2xl border border-(--border-soft) bg-(--input-bg) p-2 pl-4 backdrop-blur-sm transition-colors focus-within:border-(--border-mid)'
            : 'flex items-center gap-2 rounded-full border border-(--glass-border) bg-(--glass-b) p-1.5 pl-3.5 backdrop-blur-sm transition-colors focus-within:border-(--border-mid)'
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
          aria-label="Search Voyora"
          aria-expanded={open && query.trim().length > 0}
          aria-controls="site-search-results"
          role="combobox"
          aria-autocomplete="list"
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
        <div
          id="site-search-results"
          role="listbox"
          className="liquid-glass liquid-glass--dense absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-2xl p-2"
        >
          {matches.length > 0 ? (
            <ul>
              {matches.map((item, i) => {
                const Icon = TYPE_ICON[item.type];
                const showHeading = i === 0 || matches[i - 1].type !== item.type;
                return (
                  <li key={item.key}>
                    {showHeading && (
                      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-(--text-secondary)">
                        {TYPE_LABEL[item.type]}
                      </p>
                    )}
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeIndex === i}
                      onClick={() => goTo(item.to)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        activeIndex === i ? 'bg-(--surface-card-hover)' : ''
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                        <Icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-(--text-primary)">
                          {item.title}
                        </span>
                        <span className="block truncate text-xs text-(--text-secondary)">
                          {item.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-(--text-primary)">No results for "{query.trim()}"</p>
              <p className="mt-1 text-xs text-(--text-secondary)">
                Try a destination, country, or blog topic.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
