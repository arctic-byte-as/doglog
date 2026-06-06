"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextError = params.get('error');
    if (nextError === 'password-required') {
      setError('A password needs to be set for this account before signing in.');
    }
  }, []);

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
            Sign in with your email and password. You&apos;ll stay signed in on this device until you sign out.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-brand-950">Email</span>
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

            <label className="block">
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

            <button type="submit" className="w-full rounded-lg bg-brand-700 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          </form>

          <Link href="/forgot-password" className="mt-5 inline-flex text-sm font-semibold text-brand-800">
            Forgot password?
          </Link>
        </div>
      </main>
    </div>
  );
}
