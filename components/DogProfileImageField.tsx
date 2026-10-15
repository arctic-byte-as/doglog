"use client";

import { useState } from 'react';
import DogPhotoPicker from './DogPhotoPicker';

const avatarOptions = [
  '/dog-avatars/avatar-01.svg',
  '/dog-avatars/avatar-02.svg',
  '/dog-avatars/avatar-03.svg',
  '/dog-avatars/avatar-04.svg',
  '/dog-avatars/avatar-05.svg',
  '/dog-avatars/avatar-06.svg',
];

export default function DogProfileImageField({
  value,
  onChange,
  disabled = false,
  uploadSuccessMessage = 'Photo uploaded. Save the dog to keep this picture.',
  labels,
  locale = 'en',
}: {
  locale?: 'en' | 'nb';
  value: string;
  onChange: (value: string) => void | Promise<void>;
  disabled?: boolean;
  uploadSuccessMessage?: string;
  labels?: {
    profilePicture: string;
    dog: string;
    uploadPhoto: string;
    uploading: string;
    remove: string;
    chooseAvatar: string;
    imageUrl: string;
    placeholder: string;
    uploadError: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage('');

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/customer/uploads', {
        method: 'POST',
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || labels?.uploadError || 'Could not upload image.');
      await onChange(data.url);
      setMessage(uploadSuccessMessage);
    } finally {
      setUploading(false);
    }
  }

  async function saveChoice(url: string) {
    setUploading(true); setFailed(false); setMessage('');
    try { await onChange(url); setMessage(uploadSuccessMessage); }
    catch { setFailed(true); setMessage(labels?.uploadError || 'Could not save photo. Please try again.'); }
    finally { setUploading(false); }
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <span className="text-sm font-medium text-brand-800">{labels?.profilePicture || 'Profile picture'}</span>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" aria-label={labels?.uploadPhoto || 'Change photo'} disabled={disabled || uploading} onClick={() => setOpen(true)} className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-brand-200 bg-brand-50 text-xl font-semibold text-brand-700">
          {value ? <span className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${value})` }} /> : labels?.dog || 'Dog'}
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => { setFailed(false); setMessage(''); setOpen(true); }}
            className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 disabled:opacity-60"
          >
            {uploading ? labels?.uploading || 'Uploading...' : labels?.uploadPhoto || 'Upload photo'}
          </button>
          {value ? (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => saveChoice('')}
              className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 disabled:opacity-60"
            >
              {labels?.remove || 'Remove'}
            </button>
          ) : null}
        </div>
      </div>

      {open ? <DogPhotoPicker locale={locale} onSave={handleUpload} onClose={() => setOpen(false)} /> : null}
      <details><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">{labels?.chooseAvatar || 'Choose dog avatar'}</summary>
      <div className="grid grid-cols-6 gap-2">
        {avatarOptions.map((avatar) => (
          <button
            key={avatar}
            type="button"
            disabled={disabled || uploading}
            onClick={() => saveChoice(avatar)}
            className={`aspect-square overflow-hidden rounded-full border bg-white p-1 transition hover:border-brand-400 disabled:opacity-60 ${
              value === avatar ? 'border-brand-700' : 'border-brand-200'
            }`}
            aria-label={labels?.chooseAvatar || 'Choose dog avatar'}
          >
            <span className="block h-full w-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${avatar})` }} />
          </button>
        ))}
      </div>

      </details>

      {message ? <p role={failed ? 'alert' : 'status'} className="text-sm text-brand-700">{message}</p> : null}
    </div>
  );
}
