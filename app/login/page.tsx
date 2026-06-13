"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextError = params.get('error');
    if (nextError === 'password-required') {
      setError('A password needs to be set for this account before signing in.');
    } else if (nextError === 'account-not-linked') {
      const failedEmail = params.get('email');
      setError(
        failedEmail
          ? `No Norse Paw account is linked to ${failedEmail}. Please ask your trainer to add this email first.`
          : 'No Norse Paw account is linked to that email. Please ask your trainer to add it first.',
      );
    } else if (nextError) {
      setError('Sign-in could not be completed. Please try again.');
    }
  }, []);

  function callbackUrl() {
    return `${window.location.origin}/auth/callback?next=/auth/resolve`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setError(data?.error || 'Sign-in failed. Please check your email and password.');
      return;
    }

    window.location.href = '/auth/resolve';
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl(),
      },
    });

    if (signInError) {
      setGoogleLoading(false);
      setError(signInError.message || 'Could not start Google sign-in.');
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-900">
      <header className="border-b border-brand-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Logo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[22rem] px-4 py-8 sm:max-w-md sm:px-6 sm:py-10">
        <div className="w-full rounded-lg border border-brand-200 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-600">Secure sign in</p>
          <h1 className="mt-3 text-2xl font-semibold text-brand-950">Welcome to Norse Paw</h1>
          <p className="mt-2 text-sm leading-6 text-brand-700">
            Use the same email address your trainer has for you. New owners can create an account below.
          </p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {googleLoading ? 'Opening Google...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
              <span className="h-px flex-1 bg-brand-200" />
              or
              <span className="h-px flex-1 bg-brand-200" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-brand-950">Email address</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
              />
            </label>

            <div className="rounded-lg border border-brand-200 bg-white p-4">
              <p className="text-sm font-semibold text-brand-950">Have a password?</p>
              <p className="mt-1 text-sm leading-5 text-brand-700">Use this if your trainer gave you a password or you created one before.</p>
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-brand-950">Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
                />
              </label>

              <button type="submit" className="mt-4 w-full rounded-lg bg-brand-900 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in with password'}
              </button>
            </div>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          </form>

          <div className="mt-6 space-y-3 border-t border-brand-200 pt-5 text-sm">
            <p className="text-brand-700">New to Norse Paw?</p>
            <Link href="/register/owner" className="inline-flex w-full justify-center rounded-lg border border-brand-200 bg-white px-4 py-2 font-semibold text-brand-900 transition hover:border-brand-400">
              Create owner account
            </Link>
            <Link href="/forgot-password" className="inline-flex font-semibold text-brand-800">
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
