"use client";

import { useState } from 'react';
import DogProfileImageField from '@/components/DogProfileImageField';

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

export default function CustomerDogForm({ disabled = false }: { disabled?: boolean }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    breed: '',
    profileImageUrl: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/customer/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not add dog.');
      setMessage('Dog added');
      setForm({ name: '', age: '', breed: '', profileImageUrl: '' });
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || 'Could not add dog.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Dog name</span>
          <input required disabled={disabled} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Age</span>
          <input disabled={disabled} value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">Breed</span>
          <select disabled={disabled} value={form.breed} onChange={(event) => setForm({ ...form, breed: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50">
            <option value="">Select a breed</option>
            {breedOptions.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        <DogProfileImageField
          disabled={disabled}
          value={form.profileImageUrl}
          onChange={(value) => setForm({ ...form, profileImageUrl: value })}
          uploadSuccessMessage="Photo uploaded. Add dog to keep this picture."
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={disabled || loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Adding...' : 'Add dog'}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
