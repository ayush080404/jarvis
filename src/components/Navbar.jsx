import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Globe2, Menu, X, LogOut, Bookmark } from 'lucide-react';
import { useScrollY } from '../hooks/useScrollY';
import ThemeToggle from './ThemeToggle';
import SearchBox from './SearchBox';
import { getCurrentUser, logout, onAuthChange } from '../utils/auth';
import { getSavedSlugs, onSavedChange } from '../utils/saved';

const links = [
  { label: 'Explore', to: '/explore' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Trip Planner', to: '/trip-planner' },
  { label: 'AI Guide', to: '/ai-guide' },
  { label: 'Travel Blog', to: '/travel-blog' },
];

export default function Navbar() {
  const scrollY = useScrollY();
  const scrolled = scrollY > 24;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    // onAuthChange fires immediately with the current session, then again
    // on every future login/logout — no separate initial fetch needed.
    const unsubscribe = onAuthChange((currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    function refreshSavedCount() {
      getSavedSlugs().then((slugs) => {
        if (!cancelled) setSavedCount(slugs.length);
      });
    }
    refreshSavedCount();
    const unsubscribe = onSavedChange(refreshSavedCount);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user]);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    navigate('/');
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10" data-print-hide>
      <nav
        className={[
          'liquid-glass relative mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-3xl px-5 py-3 transition-[background-color,box-shadow,border-color] duration-300 sm:rounded-full',
          scrolled ? 'liquid-glass--dense' : '',
        ].join(' ')}
      >
        {/* glass shine overlay */}
        <span aria-hidden className="liquid-glass__shine" />

        <Link to="/" className="relative z-10 flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
            <Globe2 size={18} strokeWidth={2} className="text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-(--text-primary)">
            Voyora
          </span>
        </Link>

        <ul className="relative z-10 hidden items-center gap-8 text-sm font-medium text-(--text-tertiary) md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-(--text-primary) ${
                    isActive ? 'text-(--text-primary)' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
          <div ref={searchWrapRef} className="relative hidden md:block">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((o) => !o)}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                searchOpen
                  ? 'border-(--border-mid) text-(--text-primary)'
                  : 'border-(--glass-border) text-(--text-tertiary) hover:border-(--border-mid) hover:text-(--text-primary)'
              }`}
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-80">
                <SearchBox
                  variant="navbar"
                  autoFocus
                  placeholder="Search destinations..."
                  onNavigate={() => setSearchOpen(false)}
                />
              </div>
            )}
          </div>

          <Link
            to="/saved"
            aria-label={`Saved destinations (${savedCount})`}
            className="relative hidden h-10 w-10 place-items-center rounded-full border border-(--glass-border) text-(--text-tertiary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary) md:grid"
          >
            <Bookmark size={16} />
            {savedCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/my-voyora"
                className="rounded-full border border-(--glass-border) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid)"
              >
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="grid h-10 w-10 place-items-center rounded-full border border-(--glass-border) text-(--text-tertiary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary)"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-(--glass-border) px-5 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid) md:block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-gradient hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.03] md:flex"
              >
                Get Started
                <span aria-hidden>&rarr;</span>
              </Link>
            </>
          )}

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-(--glass-border) text-(--text-primary) md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="liquid-glass liquid-glass--dense relative mx-auto mt-2 max-w-6xl rounded-3xl p-4 md:hidden">
          <div className="mb-3">
            <SearchBox
              variant="navbar"
              placeholder="Search destinations..."
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
          <ul className="flex flex-col gap-1 text-sm font-medium text-(--text-tertiary)">
            {links.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2.5 transition-colors hover:bg-(--surface-card) hover:text-(--text-primary) ${
                      isActive ? 'text-(--text-primary)' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/saved"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-(--surface-card) hover:text-(--text-primary) ${
                    isActive ? 'text-(--text-primary)' : ''
                  }`
                }
              >
                Saved
                {savedCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-voyora"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 transition-colors hover:bg-(--surface-card) hover:text-(--text-primary) ${
                    isActive ? 'text-(--text-primary)' : ''
                  }`
                }
              >
                My Voyora
              </NavLink>
            </li>
          </ul>
          <div className="mt-3 flex gap-2 border-t border-(--border-soft) pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl border border-(--glass-border) px-4 py-2.5 text-center text-sm font-medium text-(--text-primary)"
              >
                Log out ({user.name.split(' ')[0]})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-xl border border-(--glass-border) px-4 py-2.5 text-center text-sm font-medium text-(--text-primary)"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-gradient flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
