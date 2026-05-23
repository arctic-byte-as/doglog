"use client";

import { useState } from 'react';

export default function CreateTrainerForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setMessage('Trainer created. Reloading...');
      setTimeout(() => window.location.reload(), 800);
    } catch (err: any) {
      setMessage(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-brand-700">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-brand-700">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </div>
      <div>
        <button type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-white" disabled={loading}>
          {loading ? 'Creating…' : 'Create trainer'}
        </button>
      </div>
      {message ? <p className="text-sm text-brand-700">{message}</p> : null}
    </form>
  );
}
