'use client';

import { useEffect, useState } from 'react';
import type { CoreSkill } from '@/lib/skills-library';
import { parseRecommendedVideos, type RecommendedVideo } from '@/lib/recommended-videos';
import { youtubeId } from '@/lib/youtube';

export type RecommendationCustomer = { id: string; name: string };

export default function SkillsRecommendations({ skill, customers }: { skill: CoreSkill; customers: RecommendationCustomer[] }) {
  const [customerId, setCustomerId] = useState('');
  const [loadedId, setLoadedId] = useState('');
  const [videos, setVideos] = useState<RecommendedVideo[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoadedId(''); setVideos([]); setError(''); setMessage('');
    if (!customerId) return;
    fetch(`/api/customers/${encodeURIComponent(customerId)}/videos`, { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load recommendations.');
      const parsed = parseRecommendedVideos(data.videos);
      if (!parsed) throw new Error('Could not load recommendations.');
      if (!cancelled) { setVideos(parsed); setLoadedId(customerId); }
    }).catch((failure) => { if (!cancelled) setError(failure.message || 'Could not load recommendations.'); });
    return () => { cancelled = true; };
  }, [customerId, attempt]);
  const ready = customerId !== '' && customerId === loadedId;
  function matches(video: RecommendedVideo, title: string, url: string) { return video.subject === skill.title && video.title === title && youtubeId(video.youtubeUrl) === youtubeId(url); }
  async function save() {
    if (!ready || saving) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}/videos`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videos }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save recommendations.');
      setMessage('Recommendations saved. Recommended Videos is enabled on this customer’s home page.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not save recommendations.'); }
    finally { setSaving(false); }
  }
  return <section aria-label="Customer video recommendations" className="space-y-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
    <h3 className="font-semibold">Recommend to customer</h3>
    <label className="block text-sm font-medium">Customer<select aria-label="Recommendation customer" value={customerId} disabled={saving} onChange={(event) => { setCustomerId(event.target.value); setLoadedId(''); }} className="mt-2 block w-full rounded-xl border border-brand-200 bg-white px-3 py-3"><option value="">Choose a customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
    {!customers.length ? <p className="text-sm">Assign a customer’s dog to you to recommend videos.</p> : <p className="text-sm">Choose a customer, tick videos for this subject and save. Untick a video to remove that recommendation.</p>}
    {customerId && !ready && !error ? <p role="status" className="text-sm">Loading recommendations…</p> : null}
    <fieldset disabled={!ready || saving} className="space-y-2"><legend className="mb-2 text-sm font-semibold">Recommend videos from {skill.title}</legend>{skill.subcategories.map((lesson, index) => {
      const available = Boolean(youtubeId(lesson.youtubeUrl));
      const checked = videos.some((video) => matches(video, lesson.title, lesson.youtubeUrl));
      return <label key={`${lesson.title}-${index}`} className="flex items-start gap-3 rounded-xl border border-brand-200 bg-white p-3 text-sm"><input type="checkbox" checked={checked} disabled={!available || !ready || saving || (!checked && videos.length >= 30)} onChange={(event) => { setMessage(''); setVideos((current) => event.target.checked ? [...current, { id: crypto.randomUUID(), subject: skill.title, title: lesson.title, youtubeUrl: lesson.youtubeUrl, notes: '' }] : current.filter((video) => !matches(video, lesson.title, lesson.youtubeUrl))); }} className="mt-1 h-4 w-4 shrink-0 accent-brand-700" /><span className="min-w-0 break-words">{lesson.title}{!available ? <span className="mt-1 block text-xs">Add a YouTube link to this lesson first.</span> : null}</span></label>;
    })}</fieldset>
    {error ? <div><p role="alert" className="text-sm text-red-800">{error}</p>{!ready ? <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-2 text-sm underline">Retry</button> : null}</div> : null}
    {message ? <p role="status" className="text-sm">{message}</p> : null}
    <button type="button" disabled={!ready || saving} onClick={save} className="w-full rounded-full bg-brand-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save recommendations'}</button>
    {ready ? <p className="text-xs">{videos.length} of 30 recommended videos across all subjects.</p> : null}
  </section>;
}
