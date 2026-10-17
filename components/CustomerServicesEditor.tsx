'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import VideoRecommendationsEditor from './VideoRecommendationsEditor';
import { parseRecommendedVideos, type RecommendedVideo } from '@/lib/recommended-videos';
import { customerServiceOptions } from '@/lib/service-options';

export default function CustomerServicesEditor({ customer, onClose, onSaved }: {
  customer: { id: string; name: string; serviceKeys: string[] };
  onClose: () => void;
  onSaved: (services: string[]) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [selected, setSelected] = useState(new Set(customer.serviceKeys));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState<RecommendedVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadingVideos(true); setLoadError('');
    fetch(`/api/customers/${encodeURIComponent(customer.id)}/videos`, { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load recommended videos.');
      const parsed = parseRecommendedVideos(data.videos);
      if (!parsed) throw new Error('Could not load recommended videos.');
      if (!cancelled) setVideos(parsed);
    }).catch((failure) => { if (!cancelled) setLoadError(failure.message || 'Could not load recommended videos.'); }).finally(() => { if (!cancelled) setLoadingVideos(false); });
    return () => { cancelled = true; };
  }, [customer.id, loadAttempt]);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; previousFocus?.focus(); };
  }, []);

  async function save() {
    if (loadingVideos || loadError) return;
    if (selected.has('RECOMMENDED_VIDEOS') && !parseRecommendedVideos(videos)) { setError('Add a subject, title and valid YouTube link to each video.'); return; }
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/customers/${customer.id}/services`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ services: Array.from(selected), recommendedVideos: selected.has('RECOMMENDED_VIDEOS') ? videos : undefined }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'Could not save changes. Please try again.');
      if (!Array.isArray(data?.services)) throw new Error('Could not confirm the saved services. Please try again.');
      onSaved(data.services);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save changes. Please try again.');
    } finally { setSaving(false); }
  }

  return createPortal(
    <dialog ref={dialog} aria-labelledby={titleId} onClose={() => { if (dialog.current && !dialog.current.open) onClose(); }} onCancel={(event) => { if (saving) event.preventDefault(); }} className="fixed inset-0 m-0 h-[100dvh] max-h-[100dvh] w-screen max-w-none overflow-hidden bg-white p-0 text-brand-950 backdrop:bg-black/50 sm:m-auto sm:h-[90dvh] sm:max-h-[850px] sm:w-[94vw] sm:max-w-2xl sm:rounded-3xl">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-brand-100 p-5 sm:p-6">
          <div><h2 id={titleId} className="text-xl font-semibold">Services &amp; courses</h2><p className="mt-1 text-sm text-brand-700">{customer.name}</p></div>
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-brand-200 px-3 py-2 text-sm disabled:opacity-50">Close</button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <p className="mb-5 text-sm text-brand-700">Choose this customer’s services and course access. Changes apply to their customer account.</p>
          {['Services', 'Courses'].map((group) => (
            <fieldset key={group} disabled={saving} className="mb-5 space-y-3">
              <legend className="mb-3 font-semibold">{group}</legend>
              {customerServiceOptions.filter((option) => option.key.endsWith('_COURSE') === (group === 'Courses')).map((option) => (
                <label key={option.key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${selected.has(option.key) ? 'border-brand-700 bg-brand-50' : 'border-brand-200 bg-white'}`}>
                  <input type="checkbox" checked={selected.has(option.key)} onChange={(event) => { const checked = event.target.checked; setSelected((current) => { const next = new Set(current); if (checked) next.add(option.key); else next.delete(option.key); return next; }); }} className="mt-1 h-4 w-4 shrink-0 accent-brand-700" />
                  <span><span className="block text-sm font-semibold">{option.title}</span><span className="mt-1 block text-xs leading-5 text-brand-700">{option.key.endsWith('_COURSE') ? 'Give access to this course and its training material.' : `Enable ${option.title.toLowerCase()} in the customer’s services.`}</span></span>
                </label>
              ))}
            </fieldset>
          ))}
          {loadingVideos ? <p role="status" className="text-sm">Loading customer videos…</p> : loadError ? <div><p role="alert" className="text-sm text-red-800">{loadError}</p><button type="button" onClick={() => setLoadAttempt((value) => value + 1)} className="mt-2 rounded-full border border-brand-200 px-4 py-2 text-sm">Retry loading videos</button></div> : selected.has('RECOMMENDED_VIDEOS') ? <VideoRecommendationsEditor videos={videos} onChange={setVideos} disabled={saving} /> : null}
          {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        </div>
        <footer className="flex flex-wrap justify-end gap-3 border-t border-brand-100 bg-white p-5 sm:p-6">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-brand-200 px-4 py-3 text-sm disabled:opacity-50">Cancel</button>
          <button type="button" disabled={saving || loadingVideos || Boolean(loadError)} onClick={save} className="rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save services & courses'}</button>
        </footer>
      </div>
    </dialog>, document.body
  );
}
