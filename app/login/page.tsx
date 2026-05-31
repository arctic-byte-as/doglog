"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

const authRedirectPath = '/auth/callback?next=/auth/resolve';

function authRedirectUrl() {
  return `${window.location.origin}${authRedirectPath}`;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');
    if (!errorCode) return;

    if (errorCode === 'account-not-linked') {
      setError('This email is signed in, but it is not linked to a Doglog account yet. New owners should complete registration first.');
      return;
    }

    setError('Sign-in could not be completed. Please try again.');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authRedirectUrl(),
      },
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Could not send the sign-in email. Check the Supabase Auth settings.');
      return;
    }

    setSent(true);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectUrl(),
      },
    });

    if (signInError) {
      setGoogleLoading(false);
      setError(signInError.message || 'Could not start Google sign-in. Check the Supabase Auth provider settings.');
    }
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
              Sign in with Google or get a one-time email link. You&apos;ll stay signed in on this device until you sign out.
            </p>

            {sent ? (
              <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-800">
                <p className="font-semibold text-brand-950">Check {email} for your sign-in link.</p>
                <p className="mt-2 leading-6">
                  The link will open Doglog and take you to the right workspace for your account.
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
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand-200 bg-white px-4 py-3 font-medium text-brand-900 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-60"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-200 text-xs font-semibold">G</span>
                  {googleLoading ? 'Opening Google...' : 'Continue with Google'}
                </button>

                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-brand-500">
                  <span className="h-px flex-1 bg-brand-200" />
                  <span>Email link</span>
                  <span className="h-px flex-1 bg-brand-200" />
                </div>

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
                  {loading ? 'Sending link...' : 'Email me a sign-in link'}
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
