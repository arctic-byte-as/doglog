"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Logo from '@/components/Logo';

type LoginMode = 'trainer' | 'owner';
type DevSigninLink = {
  email: string;
  url: string;
  createdAt: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<LoginMode>('trainer');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [devLink, setDevLink] = useState<DevSigninLink | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('email', {
      email,
      callbackUrl: mode === 'trainer' ? '/dashboard' : '/customer',
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError('Could not send the sign-in email. Check the local SMTP server or email provider settings.');
      return;
    }

    setSent(true);
    fetch('/api/dev/signin-link')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setDevLink(data?.link ?? null))
      .catch(() => setDevLink(null));
  }

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-md px-6 py-10">
        <div className="space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-brand-950">Welcome to Norse Paw</h1>
          <p className="mt-2 text-sm text-brand-700">New owners can complete registration before signing in.</p>
          <Link href="/register/owner" className="mt-5 inline-flex w-full justify-center rounded-lg bg-brand-700 px-4 py-2 font-medium text-white">
            Complete owner registration
          </Link>
          <div className="my-6 border-t border-brand-200" />
          <h2 className="text-lg font-semibold text-brand-950">I already have an account</h2>
          <p className="mt-2 text-sm text-brand-700">Enter your email and we&apos;ll send a login link.</p>

          {sent ? (
            <div className="mt-6 space-y-3 text-sm text-brand-700">
              <p>The sign-in link is ready.</p>
              {devLink ? (
                <a href={devLink.url} className="inline-flex rounded-lg bg-brand-700 px-4 py-2 font-medium text-white">
                  Continue sign in
                </a>
              ) : (
                <a
                  href="http://localhost:8025"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg bg-brand-700 px-4 py-2 font-medium text-white"
                >
                  Open MailHog inbox
                </a>
              )}
              <p>{devLink ? 'Use this same browser to finish signing in.' : 'Open the newest sign-in message and click the link in this same browser.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode('trainer')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    mode === 'trainer' ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 bg-white text-brand-800'
                  }`}
                >
                  Sign in as trainer
                </button>
                <button
                  type="button"
                  onClick={() => setMode('owner')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    mode === 'owner' ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 bg-white text-brand-800'
                  }`}
                >
                  Sign in as owner
                </button>
              </div>
              <label className="block">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-brand-200 px-4 py-2"
                />
              </label>
              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand-700 px-4 py-2 text-white"
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send sign-in link'}
                </button>
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
            </form>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
