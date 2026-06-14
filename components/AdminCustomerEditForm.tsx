"use client";

import { useState } from 'react';

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
};

export default function AdminCustomerEditForm({ customer }: { customer: CustomerRecord }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    notes: customer.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not update customer.');
      setMessage('Customer updated.');
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Could not update customer.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-full border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
      >
        {open ? 'Close edit' : 'Edit customer'}
      </button>

      {open ? (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-brand-200 bg-brand-50 p-3 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-brand-800">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
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
            <span className="text-sm font-medium text-brand-800">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Save customer'}
            </button>
            {message ? <p className="text-sm text-brand-700">{message}</p> : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
