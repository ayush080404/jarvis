import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { signup } from '../utils/auth';
import { usePageTitle } from '../hooks/usePageTitle';

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
  usePageTitle('Sign Up');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await signup({ name, email, password });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    navigate('/');
  }

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

      {needsConfirmation ? (
        <div className="mt-8 rounded-xl border border-(--border-soft) bg-(--surface-card) p-5">
          <p className="text-sm font-medium text-(--text-primary)">Check your email</p>
          <p className="mt-1.5 text-sm text-(--text-secondary)">
            We sent a confirmation link to <span className="text-(--text-primary)">{email}</span>.
            Click it, then come back and log in.
          </p>
          <Link
            to="/login"
            className="btn-gradient mt-4 inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Full name
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 transition-colors focus-within:border-(--border-mid)">
            <User size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Traveler"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Email
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 transition-colors focus-within:border-(--border-mid)">
            <Mail size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
            Password
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 transition-colors focus-within:border-(--border-mid)">
            <Lock size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      )}

      <p className="mt-6 text-center text-xs text-(--text-secondary)">
        By signing up, you agree to Voyora&apos;s Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  );
}
