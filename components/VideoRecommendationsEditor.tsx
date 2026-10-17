'use client';

import { useEffect, useState } from 'react';
import type { CoreSkill } from '@/lib/skills-library';
import type { RecommendedVideo } from '@/lib/recommended-videos';
import { youtubeId } from '@/lib/youtube';

type LibraryVideo = { subject: string; title: string; youtubeUrl: string; notes: string };

export default function VideoRecommendationsEditor({ videos, onChange, disabled }: { videos: RecommendedVideo[]; onChange: (videos: RecommendedVideo[]) => void; disabled: boolean }) {
  const [library, setLibrary] = useState<LibraryVideo[]>([]);
  const [query, setQuery] = useState('');
  const [libraryError, setLibraryError] = useState('');
  useEffect(() => {
    let cancelled = false;
    fetch('/api/skills-library', { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error('Could not load the Skills Library. You can still paste a YouTube link below.');
      const data = await response.json();
      if (cancelled) return;
      const skills: CoreSkill[] = data.skills || [];
      setLibrary(skills.flatMap((skill) => skill.subcategories.filter((lesson) => youtubeId(lesson.youtubeUrl)).map((lesson) => ({ subject: skill.title, title: lesson.title, youtubeUrl: lesson.youtubeUrl, notes: '' }))));
    }).catch((error) => { if (!cancelled) setLibraryError(error.message); });
    return () => { cancelled = true; };
  }, []);
  function add(video?: LibraryVideo) {
    onChange([...videos, { id: crypto.randomUUID(), subject: '', title: '', youtubeUrl: '', notes: '', ...video }]);
  }
  function update(id: string, field: keyof RecommendedVideo, value: string) { onChange(videos.map((video) => video.id === id ? { ...video, [field]: value } : video)); }
  const matches = library.filter((video) => `${video.subject} ${video.title}`.toLowerCase().includes(query.toLowerCase()));
  return <fieldset disabled={disabled} className="mt-5 min-w-0 space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
    <legend className="px-1 font-semibold">Recommended videos for this customer</legend>
    <p className="text-sm">Choose library videos or add a YouTube link. These appear directly on this customer’s home page when Recommended Videos is enabled.</p>
    {libraryError ? <p role="status" className="text-sm">{libraryError}</p> : null}
    {library.length ? <><label className="block text-sm font-medium">Search library videos<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 block w-full rounded-xl border border-brand-200 bg-white px-3 py-3" /></label>
      <div className="max-h-48 space-y-2 overflow-y-auto">{matches.map((video, index) => <button key={`${video.subject}-${video.title}-${index}`} type="button" disabled={disabled || videos.length >= 30 || videos.some((item) => youtubeId(item.youtubeUrl) === youtubeId(video.youtubeUrl) && item.subject === video.subject && item.title === video.title)} onClick={() => add(video)} className="block w-full rounded-xl border border-brand-200 bg-white p-3 text-left text-sm disabled:opacity-50">+ {video.subject} · {video.title}</button>)}{!matches.length ? <p className="text-sm">No library videos match.</p> : null}</div></> : <p className="text-sm">You can add your own YouTube links below.</p>}
    {videos.map((video, index) => <div key={video.id} className="min-w-0 space-y-3 rounded-xl border border-brand-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">Video {index + 1}</h3><button type="button" onClick={() => onChange(videos.filter((item) => item.id !== video.id))} className="rounded-full border border-brand-200 px-3 py-2 text-sm" aria-label={`Remove video ${index + 1}`}>Remove</button></div>
      {([{ field: 'subject', label: 'Subject', max: 100 }, { field: 'title', label: 'Video title', max: 160 }, { field: 'youtubeUrl', label: 'YouTube link', max: 2048 }] as const).map(({ field, label, max }) => <label key={field} className="block text-sm font-medium">{label}<input type={field === 'youtubeUrl' ? 'url' : 'text'} value={video[field]} maxLength={max} onChange={(event) => update(video.id, field, event.target.value)} className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-3" /></label>)}
      <label className="block text-sm font-medium">Practice note (optional)<textarea value={video.notes} maxLength={2000} onChange={(event) => update(video.id, 'notes', event.target.value)} className="mt-1 block min-h-20 w-full rounded-lg border border-brand-200 px-3 py-3" /></label>
    </div>)}
    <button type="button" disabled={disabled || videos.length >= 30} onClick={() => add()} className="rounded-full border border-brand-200 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50">+ Add YouTube video</button>
    <p className="text-xs">{videos.length} of 30 videos. Remove a video to stop sharing it. Disabling the service hides the collection without deleting it.</p>
  </fieldset>;
}
