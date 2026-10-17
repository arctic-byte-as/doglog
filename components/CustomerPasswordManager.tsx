'use client';

import { useState } from 'react';

type Customer = { id: string; name: string; email: string; canReset: boolean };

export default function CustomerPasswordManager({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const visible = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  function clear() { setSelected(null); setPassword(''); setConfirm(''); setError(''); }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || saving) return;
    setError(''); setMessage('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/customers/${encodeURIComponent(selected.id)}/password`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, confirmPassword: confirm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update password.');
      setMessage(`Password updated for ${selected.name}. Their previous sign-ins and reset links have been cleared. Share the new password with the customer securely.`);
      clear();
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not update password.'); }
    finally { setSaving(false); }
  }
  return <section className="space-y-5">
    <p className="text-sm text-brand-700">Existing passwords cannot be viewed. Changing a password signs the customer out on all devices. No email is sent.</p>
    {message ? <p role="status" className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm">{message}</p> : null}
    {selected ? <form onSubmit={save} className="space-y-4 rounded-2xl border border-brand-200 bg-white p-5">
      <h2 className="break-words text-lg font-semibold">Set password for {selected.name}</h2><p className="break-all text-sm">{selected.email}</p>
      <label className="block text-sm font-medium">New password<input autoFocus type="password" autoComplete="new-password" required minLength={10} maxLength={128} disabled={saving} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 block w-full rounded-xl border border-brand-200 px-4 py-3" /></label>
      <label className="block text-sm font-medium">Confirm new password<input type="password" autoComplete="new-password" required minLength={10} maxLength={128} disabled={saving} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 block w-full rounded-xl border border-brand-200 px-4 py-3" /></label>
      <p className="text-sm">Use 10–128 characters. This replaces the customer’s current password.</p>
      {error ? <p role="alert" className="text-sm text-red-800">{error}</p> : null}
      <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Set new password'}</button><button type="button" disabled={saving} onClick={clear} className="rounded-full border border-brand-200 px-5 py-3 text-sm">Cancel</button></div>
    </form> : null}
    <label className="block text-sm font-semibold">Find a customer<input type="search" placeholder="Search by name or email" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 block w-full rounded-xl border border-brand-200 bg-white px-4 py-3" /></label>
    <p role="status" className="text-sm">{visible.length} customers</p>
    <ul className="space-y-3">{visible.map((customer) => <li key={customer.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-white p-4"><div className="min-w-0"><h2 className="break-words font-semibold">{customer.name}</h2><p className="break-all text-sm">{customer.email}</p>{!customer.canReset ? <p className="mt-1 text-xs">No customer login available, or this is a protected trainer/admin account.</p> : null}</div><button type="button" disabled={saving || !customer.canReset} onClick={() => { clear(); setMessage(''); setSelected(customer); }} aria-label={`Change password for ${customer.name}`} className="rounded-full border border-brand-200 px-4 py-3 text-sm font-semibold disabled:opacity-50">Change password</button></li>)}</ul>
    {!visible.length ? <p className="rounded-xl bg-white p-4 text-sm">No customers match your search.</p> : null}
  </section>;
}
