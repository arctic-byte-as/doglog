"use client";

import { useState } from 'react';

type DogFormData = {
  id?: string;
  name: string;
  age: string;
  breed: string;
  owner: string;
  status: string;
  lastIncident: string;
};

const emptyDog: DogFormData = {
  name: '',
  age: '',
  breed: '',
  owner: '',
  status: 'Active',
  lastIncident: '',
};

export function DogForm({ dog, onDone }: { dog?: DogFormData; onDone?: () => void }) {
  const [form, setForm] = useState<DogFormData>(dog || emptyDog);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(dog?.id ? `/api/dogs/${dog.id}` : '/api/dogs', {
        method: dog?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not save dog.');

      setMessage('Saved');
      if (!dog) setForm(emptyDog);
      onDone?.();
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Could not save dog.');
    } finally {
      setLoading(false);
    }
  }

  function update(field: keyof DogFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Name</span>
          <input required value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Owner</span>
          <input required value={form.owner} onChange={(event) => update('owner', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Breed</span>
          <input value={form.breed} onChange={(event) => update('breed', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Age</span>
          <input value={form.age} onChange={(event) => update('age', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Status</span>
          <input value={form.status} onChange={(event) => update('status', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Last incident</span>
          <input type="date" value={form.lastIncident} onChange={(event) => update('lastIncident', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Saving...' : dog ? 'Save dog' : 'Create dog'}
        </button>
        {onDone ? (
          <button type="button" onClick={onDone} className="rounded-lg border border-brand-200 px-4 py-2 text-brand-800">
            Cancel
          </button>
        ) : null}
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
