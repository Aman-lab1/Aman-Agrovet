import { Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !passcode) {
      setError('Please enter both username and passcode.');
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), passcode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
              AMAN Agrovet V3
            </h1>
            <p className="text-xs text-muted">
              Internal Poultry Operations · Sign In
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-md border border-status-alert/40 bg-background px-3.5 py-2.5 text-xs font-medium text-status-alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-username" className="block text-xs font-semibold text-foreground">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1.5 min-h-[48px] w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="login-passcode" className="block text-xs font-semibold text-foreground">
              Passcode
            </label>
            <input
              id="login-passcode"
              type="password"
              autoComplete="current-password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter your passcode"
              className="mt-1.5 min-h-[48px] w-full rounded-md border border-border bg-background px-3.5 py-2 font-mono text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="min-h-[48px] w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Authorized AMAN Agrovet team accounts only. Contact the Business Owner for access.
        </p>
      </div>
    </div>
  );
}
