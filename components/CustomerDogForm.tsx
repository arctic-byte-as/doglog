"use client";

import type { ComponentProps } from 'react';
import { useState } from 'react';
import BreedSelect from '@/components/BreedSelect';
import DogProfileImageField from '@/components/DogProfileImageField';

const defaultDogLabels = {
  name: 'Dog name',
  age: 'Age',
  breed: 'Breed',
  selectBreed: 'Select a breed',
  otherBreed: 'Other / Add breed',
  newBreed: 'Enter breed name',
  add: 'Add dog',
  adding: 'Adding...',
  added: 'Dog added',
  addError: 'Could not add dog.',
};

type ImageLabels = ComponentProps<typeof DogProfileImageField>['labels'];

export default function CustomerDogForm({
  disabled = false,
  labels = defaultDogLabels,
  imageLabels,
  uploadSuccessMessage = 'Photo uploaded. Add dog to keep this picture.',
}: {
  disabled?: boolean;
  labels?: typeof defaultDogLabels;
  imageLabels?: ImageLabels;
  uploadSuccessMessage?: string;
}) {
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
      if (!res.ok) throw new Error(data?.error || labels.addError);
      setMessage(labels.added);
      setForm({ name: '', age: '', breed: '', profileImageUrl: '' });
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || labels.addError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.name}</span>
          <input required disabled={disabled} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.age}</span>
          <input disabled={disabled} value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.breed}</span>
          <div className="mt-1">
            <BreedSelect
              disabled={disabled}
              value={form.breed}
              onChange={(breed) => setForm({ ...form, breed })}
              labels={labels}
            />
          </div>
        </label>
        <DogProfileImageField
          disabled={disabled}
          value={form.profileImageUrl}
          onChange={(value) => setForm({ ...form, profileImageUrl: value })}
          uploadSuccessMessage={uploadSuccessMessage}
          labels={imageLabels}
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={disabled || loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? labels.adding : labels.add}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
