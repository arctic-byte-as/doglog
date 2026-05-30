"use client";

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

type LoginMode = 'trainer' | 'owner';

const loginModes: Record<LoginMode, { label: string; description: string; destination: string }> = {
  trainer: {
    label: 'Trainer workspace',
    description: 'Dashboard, dogs, consultations, services, and customer access.',
    destination: '/dashboard',
  },
  owner: {
    label: 'Owner portal',
    description: 'Training plan, dog profile, consultations, tips, and services.',
    destination: '/customer',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<LoginMode>('trainer');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const selectedMode = loginModes[mode];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(selectedMode.destination)}`,
      },
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Could not send the sign-in email. Check the Supabase Auth settings.');
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Logo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[22rem] px-4 py-8 sm:max-w-md sm:px-6 sm:py-10">
        <div className="space-y-6">
          <div className="w-full rounded-lg border border-brand-200 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-600">Secure sign in</p>
            <h1 className="mt-3 text-2xl font-semibold text-brand-950">Welcome to Norse Paw</h1>
            <p className="mt-2 text-sm leading-6 text-brand-700">
              Choose your workspace and we&apos;ll email a one-time sign-in link.
            </p>

            {sent ? (
              <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-800">
                <p className="font-semibold text-brand-950">Check {email} for your sign-in link.</p>
                <p className="mt-2 leading-6">
                  It will open the {selectedMode.label.toLowerCase()} on this site. If it lands on an error page, the callback URL for this
                  environment needs to be added in the auth settings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError('');
                  }}
                  className="mt-4 rounded-lg border border-brand-300 bg-white px-4 py-2 font-medium text-brand-800"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <fieldset>
                  <legend className="text-sm font-semibold text-brand-950">Workspace</legend>
                  <div className="mt-2 grid gap-3">
                    {(Object.keys(loginModes) as LoginMode[]).map((loginMode) => {
                      const option = loginModes[loginMode];
                      const selected = mode === loginMode;

                      return (
                        <button
                          key={loginMode}
                          type="button"
                          onClick={() => setMode(loginMode)}
                          className={`rounded-lg border p-4 text-left transition ${
                            selected ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 bg-white text-brand-800 hover:border-brand-400'
                          }`}
                          aria-pressed={selected}
                        >
                          <span className="block text-sm font-semibold">{option.label}</span>
                          <span className={`mt-1 block text-sm leading-5 ${selected ? 'text-brand-50' : 'text-brand-600'}`}>{option.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="text-sm font-semibold text-brand-950">Email</span>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
                  />
                </label>

                <button type="submit" className="w-full rounded-lg bg-brand-700 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading}>
                  {loading ? 'Sending link...' : `Email link for ${selectedMode.label.toLowerCase()}`}
                </button>

                {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
              </form>
            )}
          </div>

          <div className="w-full rounded-lg border border-brand-200 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="text-base font-semibold text-brand-950">New owner?</h2>
            <p className="mt-2 text-sm leading-6 text-brand-700">Complete registration first so your owner portal can be linked to your dog.</p>
            <Link href="/register/owner" className="mt-4 inline-flex w-full justify-center rounded-lg border border-brand-300 bg-white px-4 py-2 font-medium text-brand-800">
              Complete owner registration
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
