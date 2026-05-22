'use client';

import { useState } from 'react';
import { SiteShell } from '@/components/SiteShell';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(`Demo login for ${email || 'trainer@example.com'} successful.`);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-slate-900">Trainer login</h2>
          <p className="mt-3 text-slate-600">This demo screen shows how trainer access will work in the first version.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="trainer@example.com"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>
          <button type="submit" className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
            Sign in
          </button>
          {message ? <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        </form>
      </div>
    </SiteShell>
  );
}
