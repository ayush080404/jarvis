import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { login } from '../utils/auth';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Login() {
  usePageTitle('Log In');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/');
  }

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

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-(--text-secondary)">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-sky-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 transition-colors focus-within:border-(--border-mid)">
            <Lock size={16} className="shrink-0 text-(--text-secondary)" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((s) => !s)}
              className="shrink-0 text-(--text-secondary)"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
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
          disabled
          title="Not connected yet"
          className="cursor-not-allowed rounded-xl border border-(--border-soft) py-2.5 text-sm font-medium text-(--text-secondary) opacity-60"
        >
          Google
        </button>
        <button
          type="button"
          disabled
          title="Not connected yet"
          className="cursor-not-allowed rounded-xl border border-(--border-soft) py-2.5 text-sm font-medium text-(--text-secondary) opacity-60"
        >
          Apple
        </button>
      </div>
    </AuthLayout>
  );
}
