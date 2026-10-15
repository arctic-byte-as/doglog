"use client";

import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveDogPhoto } from '@/lib/save-dog-photo';
import BreedSelect from '@/components/BreedSelect';
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

const defaultDogLabels = {
  name: 'Dog name',
  age: 'Age',
  breed: 'Breed',
  selectBreed: 'Select a breed',
  otherBreed: 'Other / Add breed',
  newBreed: 'Enter breed name',
  status: 'Status',
  mainConcern: 'Main behaviour concern',
  save: 'Save dog',
  saving: 'Saving...',
  saved: 'Dog saved',
  saveError: 'Could not save dog.',
  delete: 'Delete dog',
  deleting: 'Deleting...',
  deleteError: 'Could not delete dog.',
  deleteConfirm: 'Delete this dog? This will also remove training records for this dog.',
};

type ImageLabels = ComponentProps<typeof DogProfileImageField>['labels'];

export default function CustomerDogProfileForm({
  dog,
  labels = defaultDogLabels,
  imageLabels,
  locale = 'en',
  uploadSuccessMessage = 'Photo uploaded and saved.',
  photoSavedMessage = 'Photo saved',
}: {
  dog: DogProfile;
  labels?: typeof defaultDogLabels;
  imageLabels?: ImageLabels;
  locale?: 'en' | 'nb';
  uploadSuccessMessage?: string;
  photoSavedMessage?: string;
}) {
  const router = useRouter();
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
  const [deleting, setDeleting] = useState(false);

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
    setLoading(true);
    try { await saveDogPhoto(dog.id, value); setForm((current) => ({ ...current, profileImageUrl: value })); setMessage(photoSavedMessage); router.refresh(); } finally { setLoading(false); }
  }

  async function deleteDog() {
    const confirmed = window.confirm(labels.deleteConfirm || defaultDogLabels.deleteConfirm);
    if (!confirmed) return;

    setDeleting(true);
    setMessage('');
    try {
      const res = await fetch(`/api/customer/dogs/${dog.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || labels.deleteError || defaultDogLabels.deleteError);
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || labels.deleteError || defaultDogLabels.deleteError);
      setDeleting(false);
    }
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
          <div className="mt-1">
            <BreedSelect value={form.breed} onChange={(breed) => update('breed', breed)} labels={labels} />
          </div>
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
          disabled={loading || deleting}
          value={form.profileImageUrl}
          onChange={saveProfileImage}
          uploadSuccessMessage={uploadSuccessMessage}
          labels={imageLabels}
          locale={locale}
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-700 px-4 py-2 text-white disabled:opacity-60">
          {loading ? labels.saving : labels.save}
        </button>
        <button
          type="button"
          onClick={deleteDog}
          disabled={deleting}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? labels.deleting || defaultDogLabels.deleting : labels.delete || defaultDogLabels.delete}
        </button>
        {message ? <p className="text-sm text-brand-700">{message}</p> : null}
      </div>
    </form>
  );
}
