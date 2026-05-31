"use client";

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ResetPasswordPage({ searchParams }: { searchParams?: { token?: string } }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const token = searchParams?.token || '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords must match.');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setError(data?.error || 'Could not reset the password.');
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Logo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[22rem] px-4 py-8 sm:max-w-md sm:px-6 sm:py-10">
        <div className="w-full rounded-lg border border-brand-200 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-600">Password reset</p>
          <h1 className="mt-3 text-2xl font-semibold text-brand-950">Choose a new password</h1>
          <p className="mt-2 text-sm leading-6 text-brand-700">
            Use at least 10 characters. After reset, existing sessions for this account are signed out.
          </p>

          {success ? (
            <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
              <p>Password updated.</p>
              <Link href="/login" className="mt-3 inline-flex font-semibold text-brand-900">
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-brand-950">New password</span>
                <input
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-brand-950">Confirm password</span>
                <input
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
                />
              </label>

              <button type="submit" className="w-full rounded-lg bg-brand-700 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading || !token}>
                {loading ? 'Updating...' : 'Update password'}
              </button>

              {!token ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">Reset link is missing or invalid.</p> : null}
              {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
