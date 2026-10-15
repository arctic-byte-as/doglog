"use client";

import { useState } from 'react';
import { DogForm } from './DogForm';

type Dog = {
  id: string;
  name: string;
  age: string;
  breed: string;
  owner: string;
  status: string;
  lastIncident: string | null;
  profileImageUrl: string | null;
  customer?: {
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

export function DogListItem({ dog }: { dog: Dog }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteDog() {
    const confirmed = window.confirm(`Delete ${dog.name}? This will also remove any observations, consultations, and service sessions for this dog.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/dogs/${dog.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not delete dog.');
      window.location.reload();
    } catch (error: any) {
      alert(error.message || 'Could not delete dog.');
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
        <DogForm
          dog={{
            ...dog,
            lastIncident: dog.lastIncident || '',
            profileImageUrl: dog.profileImageUrl || '',
          }}
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          {dog.profileImageUrl ? (
            <img src={dog.profileImageUrl} alt={dog.name} className="h-16 w-16 rounded-2xl object-cover object-top" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-xl font-semibold text-brand-700">
              {dog.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm text-brand-600">
              {dog.breed || 'Breed not set'} {dog.age ? `- ${dog.age}` : ''}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-brand-950">{dog.name}</h3>
            <p className="mt-2 text-brand-700">Owner: {dog.owner}</p>
            {dog.customer ? (
              <div className="mt-2 space-y-1 text-sm text-brand-700">
                <p>Customer: {dog.customer.name}</p>
                <p>{dog.customer.email}</p>
                {dog.customer.phone ? <p>{dog.customer.phone}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button onClick={() => setEditing(true)} className="rounded-lg border border-brand-200 px-3 py-1 text-sm text-brand-800">
            Edit
          </button>
          <button
            type="button"
            onClick={deleteDog}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Status: {dog.status}</span>
        {dog.customer ? <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Customer entry</span> : null}
        {dog.lastIncident ? <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Last incident: {dog.lastIncident}</span> : null}
      </div>
    </article>
  );
}
