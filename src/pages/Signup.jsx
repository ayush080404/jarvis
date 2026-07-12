import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

function Mosaic() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5">
      <img
        src="/images/paris.jpg"
        alt="Eiffel Tower at golden hour, Paris"
        className="col-span-1 row-span-2 h-full w-full object-cover"
      />
      <img
        src="/images/burj_khalifa.jpg"
        alt="Burj Khalifa skyline, Dubai"
        className="col-span-2 row-span-1 h-full w-full object-cover"
      />
      <img
        src="/images/statue_of_liberty.jpg"
        alt="Statue of Liberty, New York"
        className="col-span-1 row-span-1 h-full w-full object-cover"
      />
      <img
        src="/images/mount_fuji.jpg"
        alt="Mount Fuji, Japan"
        className="col-span-1 row-span-1 h-full w-full object-cover"
      />
    </div>
  );
}

export default function Signup() {
  return (
    <AuthLayout
      eyebrow="Start your journey"
      heading="Wherever you're headed, we'll help you plan it."
      subheading="Create a free account to save destinations, build itineraries, and get AI-powered guides."
      visual={<Mosaic />}
    >
      <h1 className="font-display text-2xl font-bold text-(--text-primary)">Create an account</h1>
      <p className="mt-1.5 text-sm text-(--text-secondary)">
        Already have one?{' '}
        <Link to="/login" className="font-medium text-sky-500 hover:underline">
          Log in
        </Link>
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Full name
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5">
            <User size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="text"
              placeholder="Jane Traveler"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

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
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Password
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5">
            <Lock size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="password"
              placeholder="Create a password"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01]"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-(--text-secondary)">
        By signing up, you agree to Voyora&apos;s Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  );
}
