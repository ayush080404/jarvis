import { Link } from 'react-router-dom';
import { Mail, Lock, Eye } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      heading="The world is waiting. Pick up right where you left off."
      subheading="Sign back in to your saved trips, guides, and itineraries."
      visual={
        <img
          src="/images/grand_canyon.jpg"
          alt="Sunrise over the Grand Canyon"
          className="absolute inset-0 h-full w-full object-cover"
        />
      }
    >
      <h1 className="font-display text-2xl font-bold text-(--text-primary)">Log in</h1>
      <p className="mt-1.5 text-sm text-(--text-secondary)">
        New to Voyora?{' '}
        <Link to="/signup" className="font-medium text-sky-500 hover:underline">
          Create an account
        </Link>
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Email
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5">
            <Mail size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-(--text-secondary)">Password</label>
            <a href="#" className="text-xs font-medium text-sky-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5">
            <Lock size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
            <Eye size={16} className="shrink-0 cursor-pointer text-(--text-secondary)" />
          </div>
        </div>

        <button
          type="button"
          className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01]"
        >
          Log in
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-(--border-soft)" />
        <span className="text-xs text-(--text-secondary)">or continue with</span>
        <div className="h-px flex-1 bg-(--border-soft)" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border border-(--border-soft) py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid)"
        >
          Google
        </button>
        <button
          type="button"
          className="rounded-xl border border-(--border-soft) py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:border-(--border-mid)"
        >
          Apple
        </button>
      </div>
    </AuthLayout>
  );
}
