"use client";

import { useEffect, useState } from 'react';
import DogProfileImageField from '@/components/DogProfileImageField';
import BreedSelect from '@/components/BreedSelect';

export default function OwnerRegistrationForm() {
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ownerNotes: '',
    dogName: '',
    dogAge: '',
    dogBreed: '',
    dogPhotoUrl: '',
    behaviourConcern: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  useEffect(() => {
    const url = form.dogPhotoUrl;
    return () => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); };
  }, [form.dogPhotoUrl]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading || photoBusy) return;
    setLoading(true);
    setMessage('');
    setMessageType(null);

    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords must match.');
      }

      const body = new FormData();
      body.append('details', JSON.stringify({ ...form, dogPhotoUrl: photoFile ? '' : form.dogPhotoUrl }));
      if (photoFile) body.append('file', photoFile);
      const response = await fetch('/api/register/owner', {
        method: 'POST',
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not complete registration.');

      setMessage('Registration complete. Opening your customer area...');
      setMessageType('success');
      window.location.href = '/customer';
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
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Password</span>
            <input
              required
              type="password"
              minLength={10}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Confirm password</span>
            <input
              required
              type="password"
              minLength={10}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
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
            <div className="mt-1">
              <BreedSelect value={form.dogBreed} onChange={(dogBreed) => setForm({ ...form, dogBreed })} />
            </div>
          </label>
          <DogProfileImageField
            value={form.dogPhotoUrl}
            disabled={loading}
            onBusyChange={setPhotoBusy}
            prepareUpload={async (file) => { setPhotoFile(file); return URL.createObjectURL(file); }}
            onChange={(value) => { if (!value.startsWith('blob:')) setPhotoFile(null); setForm((current) => ({ ...current, dogPhotoUrl: value })); }}
            uploadSuccessMessage="Photo ready. Create your account to save it."
          />
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
        <button type="submit" disabled={loading || photoBusy} className="rounded-lg bg-brand-700 px-5 py-2 font-medium text-white disabled:opacity-60">
          {loading ? 'Registering...' : 'Create account'}
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
