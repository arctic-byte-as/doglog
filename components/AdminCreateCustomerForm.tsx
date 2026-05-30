"use client";

import { useState } from 'react';

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

export default function AdminCreateCustomerForm() {
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not create customer.');
      setMessage('Customer created.');
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Could not create customer.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Owner name</span>
          <input required value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Email</span>
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Phone</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Dog name</span>
          <input required value={form.dogName} onChange={(event) => setForm({ ...form, dogName: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Dog age</span>
          <input value={form.dogAge} onChange={(event) => setForm({ ...form, dogAge: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Dog breed</span>
          <select value={form.dogBreed} onChange={(event) => setForm({ ...form, dogBreed: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">
            <option value="">Select a breed</option>
            {breedOptions.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-brand-800">Profile picture URL</span>
          <input type="url" value={form.dogPhotoUrl} onChange={(event) => setForm({ ...form, dogPhotoUrl: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-brand-800">Owner notes</span>
          <textarea value={form.ownerNotes} onChange={(event) => setForm({ ...form, ownerNotes: event.target.value })} className="mt-1 min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-brand-800">Main behaviour concern</span>
          <textarea required value={form.behaviourConcern} onChange={(event) => setForm({ ...form, behaviourConcern: event.target.value })} className="mt-1 min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-5 py-2 font-medium text-white disabled:opacity-60">
          {loading ? 'Creating...' : 'Create customer'}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
