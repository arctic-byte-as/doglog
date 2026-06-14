"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type BreedRow = {
  id: string;
  name: string;
  dogCount: number;
};

export default function AdminBreedListForm({ breeds }: { breeds: BreedRow[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState(() => Object.fromEntries(breeds.map((breed) => [breed.id, breed.name])));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function renameBreed(breed: BreedRow) {
    const name = drafts[breed.id]?.trim().replace(/\s+/g, ' ') || '';
    if (!name) {
      setMessage('Breed name is required.');
      return;
    }

    setBusyId(breed.id);
    setMessage('');

    const response = await fetch(`/api/dog-breeds/${breed.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await response.json().catch(() => ({}));

    setBusyId(null);
    if (!response.ok) {
      setMessage(data.error || 'Could not rename breed.');
      return;
    }

    setMessage('Breed updated.');
    router.refresh();
  }

  async function deleteBreed(breed: BreedRow) {
    const confirmed = window.confirm(`Remove "${breed.name}" from future breed dropdowns? Existing dog profiles will keep their breed text.`);
    if (!confirmed) return;

    setBusyId(breed.id);
    setMessage('');

    const response = await fetch(`/api/dog-breeds/${breed.id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));

    setBusyId(null);
    if (!response.ok) {
      setMessage(data.error || 'Could not remove breed.');
      return;
    }

    setMessage('Breed removed from dropdowns.');
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message ? <p className="rounded-lg border border-brand-200 bg-white px-4 py-3 text-sm text-brand-700">{message}</p> : null}

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
        <div className="hidden grid-cols-[minmax(180px,1fr)_100px_170px] gap-3 border-b border-brand-200 bg-brand-50 px-4 py-3 text-xs font-semibold uppercase text-brand-600 md:grid">
          <span>Breed</span>
          <span>Dogs</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-brand-100">
          {breeds.map((breed) => {
            const unchanged = (drafts[breed.id] || '').trim().replace(/\s+/g, ' ') === breed.name;
            const busy = busyId === breed.id;

            return (
              <div key={breed.id} className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(180px,1fr)_100px_170px] md:items-center">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-brand-600 md:hidden">Breed</span>
                  <input
                    value={drafts[breed.id] || ''}
                    onChange={(event) => setDrafts((current) => ({ ...current, [breed.id]: event.target.value }))}
                    className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
                  />
                </label>
                <p className="text-sm text-brand-700">
                  <span className="font-semibold md:hidden">Dogs: </span>
                  {breed.dogCount}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy || unchanged}
                    onClick={() => renameBreed(breed)}
                    className="rounded-full border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => deleteBreed(breed)}
                    className="rounded-full border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
