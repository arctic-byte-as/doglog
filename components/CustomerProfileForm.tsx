"use client";

import { useState } from 'react';

type CustomerProfile = {
  name: string;
  phone: string | null;
  notes: string | null;
};

type CustomerProfileFormData = {
  name: string;
  phone: string;
  notes: string;
};

export default function CustomerProfileForm({ customer }: { customer?: Partial<CustomerProfile> | null }) {
  const [form, setForm] = useState<CustomerProfileFormData>({
    name: customer?.name || '',
    phone: customer?.phone || '',
    notes: customer?.notes || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not save profile.');
      setMessage('Profile saved');
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-brand-800">Name</span>
        <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-brand-800">Phone</span>
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-brand-800">Notes</span>
        <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Saving...' : 'Save profile'}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
