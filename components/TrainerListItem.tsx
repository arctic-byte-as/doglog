"use client";

import { useState } from 'react';

export default function TrainerListItem({ trainer }: { trainer: any }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(trainer.name || '');
  const [email, setEmail] = useState(trainer.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/trainers/${trainer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update');
      setMessage('Updated');
      setEditing(false);
      setTimeout(() => window.location.reload(), 700);
    } catch (err: any) {
      setMessage(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this trainer and their dogs?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/trainers/${trainer.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete');
      setMessage('Deleted');
      setTimeout(() => window.location.reload(), 500);
    } catch (err: any) {
      setMessage(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="rounded-lg border border-brand-200 bg-white p-3">
      {editing ? (
        <form onSubmit={handleSave} className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-brand-200 px-2 py-1" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-brand-200 px-2 py-1" />
          <div className="flex gap-2">
            <button type="submit" className="rounded bg-brand-700 px-3 py-1 text-white" disabled={loading}>Save</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded border px-3 py-1">Cancel</button>
          </div>
          {message ? <div className="text-sm text-brand-700">{message}</div> : null}
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-brand-900">{trainer.name}</div>
            <div className="text-xs text-brand-700">{trainer.email}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="rounded border px-3 py-1">Edit</button>
            <button onClick={handleDelete} className="rounded bg-red-600 px-3 py-1 text-white" disabled={loading}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}
