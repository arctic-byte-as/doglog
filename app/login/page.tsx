"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SiteShell } from '@/components/SiteShell';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('email', { email, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError('Could not send the sign-in email. Check the local SMTP server or email provider settings.');
      return;
    }

    setSent(true);
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-brand-950">Sign in</h1>
          <p className="mt-2 text-sm text-brand-700">Enter your email and we&apos;ll send a login link.</p>

          {sent ? (
            <div className="mt-6 text-sm text-brand-700">Check your inbox for a sign-in link.</div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
    </SiteShell>
  );
}
