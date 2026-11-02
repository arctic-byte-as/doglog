'use client';
import ConsultationOwnerConnection from '@/components/ConsultationOwnerConnection';
import { useEffect, useRef, useState } from 'react';

type Version = { id: string; version: number; publishedAt: string };
export default function ConsultationPublishing({ consultationId, editing }: { consultationId: string; editing: boolean }) {
  const [ownerReady, setOwnerReady] = useState(false);
  const [latestVersion, setLatestVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const requestId = useRef<string | null>(null);
  useEffect(() => {
    let active = true;
    fetch(`/api/consultations/${encodeURIComponent(consultationId)}/versions`, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error('Could not load publication status. Refresh to try again.');
      const data = await response.json();
      if (active) setLatestVersion(data.latestVersion);
    }).catch((cause) => { if (active) setError(cause.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [consultationId]);
  async function publish() {
    if (editing || publishing || !ownerReady) return;
    setPublishing(true); setError(''); setNotice('');
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(`/api/consultations/${encodeURIComponent(consultationId)}/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: requestId.current }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Publication failed. Please retry.');
      setLatestVersion(data.version);
      setNotice(`Version ${data.version.version} published. The customer can now view this fixed report. Further edits remain private until published again.`);
      requestId.current = null;
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Publication failed. Please retry.'); }
    finally { setPublishing(false); }
  }
  const date = (value: string) => new Date(value).toLocaleString('en-GB', { timeZone: 'Europe/Oslo', dateStyle: 'medium', timeStyle: 'short' });
  return <section className="space-y-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
    <h3 className="text-base font-semibold">Work in progress — private draft</h3>
    <p className="text-sm leading-6">You have one current draft for this consultation. Saving updates this draft only. Publishing creates a fixed version for the customer; continue working here on the same draft. The customer sees published reports and history, never your draft.</p>
    {latestVersion ? <p className="text-sm">Latest published: Version {latestVersion.version} · {date(latestVersion.publishedAt)} (Oslo time)</p> : !loading && !error ? <p className="text-sm">Not published yet. The customer cannot see this draft.</p> : loading ? <p role="status" className="text-sm">Loading publication status…</p> : null}
    <ConsultationOwnerConnection consultationId={consultationId} disabled={editing || publishing} onReady={setOwnerReady} />
    <button type="button" onClick={publish} disabled={editing || publishing || loading || !ownerReady} className="min-h-11 rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{publishing ? 'Publishing…' : 'Publish final version'}</button>
    {editing ? <p className="text-sm">Save your draft before publishing.</p> : null}
    {notice ? <p role="status" className="text-sm leading-6">{notice}</p> : null}
    {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}

  </section>;
}
