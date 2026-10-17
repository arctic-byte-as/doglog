'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { youtubeId } from '@/lib/youtube';
export { youtubeId } from '@/lib/youtube';
import type { CoreSkill } from '@/lib/skills-library';

type VideoLesson = { id: string; category: string; title: string; goal: string; steps: string; coachingNotes: string; videoId: string | null; search: string };
const copy = {
  en: { search: 'Search skills videos', placeholder: 'Search by skill, topic or training goal…', all: 'All topics', count: 'lessons', watch: 'Watch video', guidance: 'View guidance', missing: 'Video not added yet', empty: 'No lessons match your search.', clear: 'Clear search', close: 'Close', goal: 'Goal', steps: 'Training details', notes: 'Coaching notes', help: 'Find a skill, choose a video and practise at your own pace.' },
  nb: { search: 'Søk i ferdighetsvideoer', placeholder: 'Søk etter ferdighet, tema eller treningsmål…', all: 'Alle temaer', count: 'leksjoner', watch: 'Se video', guidance: 'Se veiledning', missing: 'Video er ikke lagt til ennå', empty: 'Ingen leksjoner passer til søket ditt.', clear: 'Tøm søk', close: 'Lukk', goal: 'Mål', steps: 'Treningsdetaljer', notes: 'Trenertips', help: 'Finn en ferdighet, velg en video og tren i ditt eget tempo.' },
};


function LessonPlayer({ lesson, locale, onClose }: { lesson: VideoLesson; locale: 'en' | 'nb'; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const t = copy[locale];
  useEffect(() => {
    const element = dialog.current;
    const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; focus?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} aria-labelledby={titleId} onClose={() => { if (dialog.current && !dialog.current.open) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[94vw] max-w-3xl overflow-y-auto rounded-2xl bg-white p-0 text-brand-950 backdrop:bg-black/50">
    <header className="flex items-start justify-between gap-4 border-b border-brand-200 p-4 sm:p-6"><div><p className="text-xs font-semibold">{lesson.category}</p><h2 id={titleId} className="mt-1 text-lg font-semibold">{lesson.title}</h2></div><button type="button" autoFocus onClick={onClose} className="shrink-0 rounded-full border border-brand-200 px-4 py-2 text-sm">{t.close}</button></header>
    {lesson.videoId ? <div className="aspect-video bg-black"><iframe src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" /></div> : <p className="px-5 pt-5 text-sm">{t.missing}</p>}
    <div className="space-y-5 p-5 sm:p-6">{[[t.goal, lesson.goal], [t.steps, lesson.steps], [t.notes, lesson.coachingNotes]].filter(([, text]) => text).map(([label, text]) => <div key={label}><h3 className="text-sm font-semibold">{label}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6">{text}</p></div>)}</div>
  </dialog>, document.body);
}

function Thumbnail({ lesson }: { lesson: VideoLesson }) {
  const [failed, setFailed] = useState(false);
  return <div className="skills-thumbnail relative aspect-[2/1] overflow-hidden rounded-t-2xl bg-brand-100">
    {lesson.videoId && !failed ? <Image src={`https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw" className="object-cover" onError={() => setFailed(true)} /> : <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-300" />}
    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-base text-brand-950 shadow-sm">{lesson.videoId ? '▶' : '☰'}</span></span>
  </div>;
}

export default function SkillsVideoGallery({ skills, locale, inlinePlayback = false }: { inlinePlayback?: boolean; skills: CoreSkill[]; locale: 'en' | 'nb' }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<VideoLesson | null>(null);
  const inlinePlayer = useRef<HTMLElement>(null);
  useEffect(() => { if (inlinePlayback && selected) inlinePlayer.current?.scrollIntoView({ block: 'nearest' }); }, [inlinePlayback, selected]);
  const searchId = useId();
  const t = copy[locale];
  const categories = skills.map((skill) => ({ id: skill.title, title: locale === 'nb' ? skill.translations?.nb?.title || skill.title : skill.title }));
  const lessons = skills.flatMap((skill, skillIndex) => skill.subcategories.map((lesson, index) => {
    const local = locale === 'nb' ? lesson.translations?.nb : undefined;
    const title = local?.title || lesson.title;
    return { id: `${skillIndex}-${index}`, category: categories[skillIndex].title, title, goal: local?.goal || lesson.goal, steps: local?.steps || lesson.steps, coachingNotes: local?.coachingNotes || lesson.coachingNotes, videoId: youtubeId(lesson.youtubeUrl), search: [title, lesson.title, categories[skillIndex].title, skill.title, local?.goal, lesson.goal].join(' ').toLocaleLowerCase() };
  }));
  const visible = lessons.filter((lesson) => lesson.search.includes(query.trim().toLocaleLowerCase()));
  return <div className="space-y-5">
    <div className="rounded-2xl border border-brand-200 bg-white p-4 sm:p-5"><label htmlFor={searchId} className="text-sm font-semibold">{t.search}</label><input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} className="mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base" /><p role="status" className="mt-4 text-sm">{visible.length} {t.count}</p></div>
    {selected && inlinePlayback ? <section ref={inlinePlayer} aria-label={selected.title} className="overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <div className="flex items-start justify-between gap-3 p-4"><div><p className="text-xs font-semibold">{selected.category}</p><h3 className="mt-1 font-semibold">{selected.title}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-full border border-brand-200 px-4 py-2 text-sm">{t.close}</button></div>
      <div className="aspect-video bg-black"><iframe src={`https://www.youtube-nocookie.com/embed/${selected.videoId}`} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" /></div>
      {selected.steps ? <p className="whitespace-pre-line p-4 text-sm leading-6">{selected.steps}</p> : null}
    </section> : null}
    <div className={`skills-video-grid grid grid-cols-1 gap-3 ${inlinePlayback ? 'lg:grid-cols-2' : 'md:grid-cols-3 lg:grid-cols-4'}`}>{visible.map((lesson) => <button key={lesson.id} type="button" onClick={() => setSelected(lesson)} aria-haspopup="dialog" className="skill-video-tile min-w-0 overflow-hidden rounded-2xl border border-brand-200 bg-white text-left shadow-sm transition hover:border-brand-500 hover:shadow-soft"><Thumbnail lesson={lesson} /><span className="block p-3"><span className="block text-xs font-semibold text-brand-600">{lesson.category}</span><span className="mt-2 block text-sm font-semibold">{lesson.title}</span><span className="mt-3 block text-xs font-semibold">{lesson.videoId ? t.watch : t.guidance} →</span>{!lesson.videoId ? <span className="mt-1 block text-xs">{t.missing}</span> : null}</span></button>)}</div>
    {!visible.length ? <div className="rounded-2xl border border-brand-200 bg-white p-5"><p>{t.empty}</p><button type="button" onClick={() => { setQuery(''); }} className="mt-3 rounded-full border border-brand-200 px-4 py-2 text-sm">{t.clear}</button></div> : null}
    {selected && !inlinePlayback ? <LessonPlayer lesson={selected} locale={locale} onClose={() => setSelected(null)} /> : null}
  </div>;
}
