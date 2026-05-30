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
            <img src={dog.profileImageUrl} alt={dog.name} className="h-16 w-16 rounded-2xl object-cover" />
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
        <button onClick={() => setEditing(true)} className="rounded-lg border border-brand-200 px-3 py-1 text-sm text-brand-800">
          Edit
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Status: {dog.status}</span>
        {dog.customer ? <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Customer entry</span> : null}
        {dog.lastIncident ? <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">Last incident: {dog.lastIncident}</span> : null}
      </div>
    </article>
  );
}
