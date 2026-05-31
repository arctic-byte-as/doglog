"use client";

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));

    setLoading(false);
    setMessage(data?.message || 'If that email is linked to a Doglog account, a reset link has been sent.');
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
          <h1 className="mt-3 text-2xl font-semibold text-brand-950">Forgot your password?</h1>
          <p className="mt-2 text-sm leading-6 text-brand-700">
            Enter your email and we&apos;ll send a reset link if there is a Doglog account for it.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-brand-950">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-brand-200 px-4 py-2"
              />
            </label>

            <button type="submit" className="w-full rounded-lg bg-brand-700 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            {message ? <p className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</p> : null}
          </form>

          <Link href="/login" className="mt-5 inline-flex text-sm font-semibold text-brand-800">
            Back to sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
