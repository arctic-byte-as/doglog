"use client";

import { useRef, useState } from 'react';

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
}: {
  value: string;
  onChange: (value: string) => void | Promise<void>;
  disabled?: boolean;
  uploadSuccessMessage?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleUpload(file?: File) {
    if (!file) return;
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
      if (!response.ok) throw new Error(data?.error || 'Could not upload image.');
      await onChange(data.url);
      setMessage(uploadSuccessMessage);
    } catch (error: any) {
      setMessage(error.message || 'Could not upload image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <span className="text-sm font-medium text-brand-800">Profile picture</span>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-brand-200 bg-brand-50 text-xl font-semibold text-brand-700">
          {value ? <span className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${value})` }} /> : 'Dog'}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload photo'}
          </button>
          {value ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange('')}
              className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 disabled:opacity-60"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={fileInputRef}
        disabled={disabled}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />

      <div className="grid grid-cols-6 gap-2">
        {avatarOptions.map((avatar) => (
          <button
            key={avatar}
            type="button"
            disabled={disabled}
            onClick={() => onChange(avatar)}
            className={`aspect-square overflow-hidden rounded-full border bg-white p-1 transition hover:border-brand-400 disabled:opacity-60 ${
              value === avatar ? 'border-brand-700' : 'border-brand-200'
            }`}
            aria-label="Choose dog avatar"
          >
            <span className="block h-full w-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${avatar})` }} />
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-sm font-medium text-brand-800">Image URL</span>
        <input
          disabled={disabled}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/dog-photo.jpg or /uploads/dogs/photo.jpg"
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 disabled:bg-brand-50"
        />
      </label>

      {message ? <p className="text-sm text-brand-700">{message}</p> : null}
    </div>
  );
}
