import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { requestPasswordReset } from '../utils/auth';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ForgotPassword() {
  usePageTitle('Reset Password');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout
      eyebrow="Locked out?"
      heading="No worries — every good trip has a detour."
      subheading="We'll email you a link to get back into your account."
      visual={
        <img
          src="/images/grand_canyon.jpg"
          alt="Sunrise over the Grand Canyon"
          className="absolute inset-0 h-full w-full object-cover"
        />
      }
    >
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10">
            <CheckCircle2 size={24} className="text-emerald-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">Check your inbox</h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is
            on its way.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block text-sm font-medium text-sky-500 hover:underline"
          >
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            Forgot your password?
          </h1>
          <p className="mt-1.5 text-sm text-(--text-secondary)">
            Enter the email tied to your account.
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

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-(--text-secondary)">
            <Link to="/login" className="font-medium text-sky-500 hover:underline">
              Back to log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
