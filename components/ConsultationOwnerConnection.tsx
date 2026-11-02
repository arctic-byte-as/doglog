'use client';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
type Owner = { id: string; name: string; email: string };
export default function ConsultationOwnerConnection({ consultationId, disabled, onReady }: { consultationId: string; disabled: boolean; onReady: (ready: boolean) => void }) {
  const id = useId();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [customers, setCustomers] = useState<Owner[]>([]);
  const [selected, setSelected] = useState('');
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    onReady(false);
    fetch(`/api/consultations/${encodeURIComponent(consultationId)}/owner`, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error('Could not load the owner connection. Refresh to try again.');
      const data = await response.json();
      if (!active) return;
      setOwner(data.owner); setCustomers(data.customers); setSelected(data.owner?.id || ''); setAccess(data.consultationAccess); onReady(Boolean(data.owner && data.consultationAccess));
    }).catch((cause) => { if (active) setError(cause.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [consultationId, onReady]);
  async function connect() {
    setSaving(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/consultations/${encodeURIComponent(consultationId)}/owner`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId: selected }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Connection failed.');
      setOwner(data.owner); setAccess(true); onReady(true); setMessage(`Connected to ${data.owner.name}. Consultation access is enabled. Publish a final version to make the report available in their portal.`); window.location.reload();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not connect the owner.'); }
    finally { setSaving(false); }
  }
  return <section className="space-y-3 rounded-xl border border-brand-200 bg-white p-4">
    <h4 className="text-base font-semibold">Owner receiving this consultation</h4>
    {loading ? <p role="status" className="text-sm">Loading owner…</p> : owner ? <div><p className="break-words text-sm font-semibold">{owner.name}</p><p className="break-all text-sm">{owner.email}</p><p className="mt-1 text-sm">{access ? 'Connected — published reports appear in this owner’s portal.' : 'Connected, but consultation access needs to be enabled.'}</p><Link className="inline-flex min-h-11 items-center text-sm underline" href={`/dashboard?customer=${encodeURIComponent(owner.id)}#dashboard-customers`}>Open owner profile</Link></div> : <p className="text-sm leading-6">No owner account is connected to this dog yet. Select an existing customer below. Connecting enables their consultation access; drafts remain private.</p>}
    {!loading && (!owner || !access) ? <><label htmlFor={id} className="block text-sm font-medium">Owner account</label><select id={id} value={selected} onChange={(event) => setSelected(event.target.value)} disabled={disabled || saving || Boolean(owner)} className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base"><option value="">Select an owner</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} — {customer.email}</option>)}</select><button type="button" onClick={connect} disabled={!selected || disabled || saving} className="min-h-11 rounded-lg border border-brand-200 px-4 py-3 text-sm font-semibold disabled:opacity-50">{saving ? 'Connecting…' : owner ? 'Enable consultation access' : 'Connect owner and enable consultation access'}</button></> : null}
    <p className="text-sm"><Link href="/admin/customers" className="inline-flex min-h-11 items-center underline">Create or manage owner accounts</Link></p>
    {disabled ? <p className="text-sm">Save your draft before connecting an owner.</p> : null}
    {message ? <p role="status" className="text-sm leading-6">{message}</p> : null}{error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
  </section>;
}
