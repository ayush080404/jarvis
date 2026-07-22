import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { updatePassword } from '../utils/auth';
import { supabase } from '../lib/supabase';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ResetPassword() {
  usePageTitle('Set New Password');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  // Supabase turns the emailed link's URL fragment into a recovery session
  // asynchronously on load, so briefly we don't know yet whether this visit
  // is a valid recovery link or someone landing here directly.
  const [checkingLink, setCheckingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // If the link already produced a session by the time this mounts, we're good.
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) {
        setValidLink(true);
        setCheckingLink(false);
      }
    });

    // Otherwise, catch the PASSWORD_RECOVERY event that fires once Supabase
    // finishes parsing the link.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidLink(true);
      }
      setCheckingLink(false);
    });

    // Don't leave the user staring at a spinner forever if neither fires.
    const timeout = setTimeout(() => setCheckingLink(false), 3000);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  }

  return (
    <AuthLayout
      eyebrow="Almost there"
      heading="A fresh key for your next adventure."
      subheading="Choose a new password to get back into your account."
      visual={
        <img
          src="/images/grand_canyon.jpg"
          alt="Sunrise over the Grand Canyon"
          className="absolute inset-0 h-full w-full object-cover"
        />
      }
    >
      {checkingLink ? (
        <p className="text-sm text-(--text-secondary)">Verifying your link...</p>
      ) : !validLink ? (
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            This link isn't valid
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            It may have expired, or already been used. Request a new one below.
          </p>
          <Link
            to="/forgot-password"
            className="mt-8 inline-block text-sm font-medium text-sky-500 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      ) : success ? (
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            Password updated
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">Taking you to log in...</p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            Set a new password
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                New password
              </label>
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Confirm password
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-(--border-soft) bg-(--input-bg) px-4 py-2.5 transition-colors focus-within:border-(--border-mid)">
                <Lock size={16} className="shrink-0 text-(--text-secondary)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
