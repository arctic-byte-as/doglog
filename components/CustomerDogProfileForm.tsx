"use client";

import type { ComponentProps } from 'react';
import { useState } from 'react';
import DogProfileImageField from '@/components/DogProfileImageField';

type DogProfile = {
  id: string;
  name: string;
  age: string;
  breed: string;
  status: string;
  lastIncident: string | null;
  profileImageUrl: string | null;
};

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

const defaultDogLabels = {
  name: 'Dog name',
  age: 'Age',
  breed: 'Breed',
  selectBreed: 'Select a breed',
  status: 'Status',
  mainConcern: 'Main behaviour concern',
  save: 'Save dog',
  saving: 'Saving...',
  saved: 'Dog saved',
  saveError: 'Could not save dog.',
};

type ImageLabels = ComponentProps<typeof DogProfileImageField>['labels'];

export default function CustomerDogProfileForm({
  dog,
  labels = defaultDogLabels,
  imageLabels,
  uploadSuccessMessage = 'Photo uploaded and saved.',
  photoSavedMessage = 'Photo saved',
}: {
  dog: DogProfile;
  labels?: typeof defaultDogLabels;
  imageLabels?: ImageLabels;
  uploadSuccessMessage?: string;
  photoSavedMessage?: string;
}) {
  const [form, setForm] = useState({
    name: dog.name,
    age: dog.age,
    breed: dog.breed,
    status: dog.status,
    lastIncident: dog.lastIncident || '',
    profileImageUrl: dog.profileImageUrl || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function saveDog(nextForm: typeof form, successMessage: string) {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/customer/dogs/${dog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || labels.saveError);
      setForm(nextForm);
      setMessage(successMessage);
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || labels.saveError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveDog(form, labels.saved);
  }

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfileImage(value: string) {
    const nextForm = { ...form, profileImageUrl: value };
    await saveDog(nextForm, photoSavedMessage);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.name}</span>
          <input required value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.age}</span>
          <input value={form.age} onChange={(event) => update('age', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.breed}</span>
          <select value={form.breed} onChange={(event) => update('breed', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2">
            <option value="">{labels.selectBreed}</option>
            {breedOptions.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-brand-800">{labels.status}</span>
          <input value={form.status} onChange={(event) => update('status', event.target.value)} className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-brand-800">{labels.mainConcern}</span>
          <textarea value={form.lastIncident} onChange={(event) => update('lastIncident', event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2" />
        </label>
        <DogProfileImageField
          value={form.profileImageUrl}
          onChange={saveProfileImage}
          uploadSuccessMessage={uploadSuccessMessage}
          labels={imageLabels}
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? labels.saving : labels.save}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
