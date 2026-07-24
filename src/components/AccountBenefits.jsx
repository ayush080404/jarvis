import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, PenLine, RefreshCw, Zap } from 'lucide-react';
import { getCurrentUser, onAuthChange } from '../utils/auth';

const BENEFITS = [
  {
    icon: Bookmark,
    title: 'Save destinations',
    desc: "Bookmark places you're curious about and find them again later.",
  },
  {
    icon: PenLine,
    title: 'Write your own stories',
    desc: 'Share a trip you took and have it show up in the Travel Blog.',
  },
  {
    icon: RefreshCw,
    title: 'Follows you everywhere',
    desc: "Saved trips and stories sync to your account, not just this browser.",
  },
  {
    icon: Zap,
    title: 'Free, takes seconds',
    desc: 'No credit card, no long form — just an email and a password.',
  },
];

export default function AccountBenefits() {
  const [user, setUser] = useState(undefined); // undefined = not checked yet

  useEffect(() => {
    getCurrentUser().then(setUser);
    return onAuthChange(setUser);
  }, []);

  // Don't show a "why sign up" pitch to someone who already has — and don't
  // flash it briefly before the auth check resolves either.
  if (user === undefined || user) return null;

  return (
    <section className="relative border-t border-(--border-soft) bg-(--surface-strong) px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">
              Free account
            </p>
            <h2 className="font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
              Your trips, <span className="text-gradient">wherever you open Voyora</span>
            </h2>
            <p className="mt-4 max-w-md text-(--text-secondary)">
              Browsing works fine without an account — but saving destinations, writing stories,
              and picking up where you left off on another device needs one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.02]"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-(--border-soft) px-6 py-3 text-sm font-semibold text-(--text-primary) transition-colors hover:border-(--border-mid)"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-sky-400">
                  <Icon size={16} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-(--text-primary)">{title}</h3>
                <p className="mt-1 text-xs text-(--text-secondary)">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
