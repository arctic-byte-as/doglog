"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const breedOptions = [
  'Beagle',
  'Border Collie',
  'French Bulldog',
  'German Shepherd Dog',
  'Golden Retriever',
  'Great Dane',
  'Labrador Retriever',
  'Norwegian Buhund',
  'Norwegian Elkhound',
  'Norwegian Lundehund',
  'Poodle',
];

export default function OwnerRegistrationForm() {
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    ownerNotes: '',
    dogName: '',
    dogAge: '',
    dogBreed: '',
    dogPhotoUrl: '',
    behaviourConcern: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType(null);

    try {
      const response = await fetch('/api/register/owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not complete registration.');

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/customer')}`,
        },
      });
      if (error) throw new Error('Registration was saved, but the sign-in link could not be sent.');

      setMessage('Registration complete. Check your email for the sign-in link.');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Could not complete registration.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-950">Your details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Full name</span>
            <input
              required
              value={form.ownerName}
              onChange={(event) => setForm({ ...form, ownerName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Phone</span>
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-brand-800">Anything your trainer should know?</span>
            <textarea
              value={form.ownerNotes}
              onChange={(event) => setForm({ ...form, ownerNotes: event.target.value })}
              className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-950">Your dog</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Dog name</span>
            <input
              required
              value={form.dogName}
              onChange={(event) => setForm({ ...form, dogName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Age</span>
            <input
              value={form.dogAge}
              onChange={(event) => setForm({ ...form, dogAge: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Breed</span>
            <select
              value={form.dogBreed}
              onChange={(event) => setForm({ ...form, dogBreed: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            >
              <option value="">Select a breed</option>
              {breedOptions.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Profile picture URL</span>
            <input
              type="url"
              value={form.dogPhotoUrl}
              onChange={(event) => setForm({ ...form, dogPhotoUrl: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-brand-800">Main behaviour concern</span>
            <textarea
              required
              value={form.behaviourConcern}
              onChange={(event) => setForm({ ...form, behaviourConcern: event.target.value })}
              className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-5 py-2 font-medium text-white disabled:opacity-60">
          {loading ? 'Registering...' : 'Complete registration and email sign-in link'}
        </button>
      </div>
      {message ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            messageType === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-brand-200 bg-brand-50 text-brand-800'
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
