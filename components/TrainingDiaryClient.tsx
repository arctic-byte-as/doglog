'use client';

import { trainingScheduleDays } from '@/lib/training-diary';
import TrainingStatsClient from '@/components/TrainingStatsClient';
import TrainingDiaryCalendar from '@/components/TrainingDiaryCalendar';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTrainingLibrary } from '@/lib/use-training-library';

type Entry = { summary?: string; id: string; dogId: string; day: string; exerciseName: string; category: string | null; minutes: number; repetitions: number | null; result: string; completed: boolean };
export default function TrainingDiaryClient({ dogs, entries: initialEntries, locale, preview = false }: { dogs: { id: string; name: string }[]; entries: Entry[]; locale: 'en' | 'nb'; preview?: boolean }) {
  const [previewEntries, setPreviewEntries] = useState(initialEntries);
  const entries = preview ? previewEntries : initialEntries;
  const nb = locale === 'nb';
  const router = useRouter();
  const { libraryCategories, loading, error: libraryError } = useTrainingLibrary();
  const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const [dogId, setDogId] = useState(dogs[0].id);
  const [day, setDay] = useState(today);
  const blank = (): Entry => ({ id: '', dogId, day, exerciseName: '', category: null, minutes: 5, repetitions: null, result: '', completed: false });
  const [repeatDays, setRepeatDays] = useState(1);
  const [draft, setDraft] = useState<Entry | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState(false);
  const [view, setView] = useState<'diary' | 'stats'>('diary');
  const [openDay, setOpenDay] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (openDay && dialog && !dialog.open) dialog.showModal();
    if (!openDay && dialog?.open) dialog.close();
  }, [openDay]);
  const input = 'mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2';
  const button = 'min-h-11 rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold disabled:opacity-50';
  const visible = entries.filter((e) => e.dogId === dogId && (history || e.day === day));
  const completed = visible.filter((e) => e.completed);
  function exerciseSummary(entry: Entry) {
    const matchesName = (name: string) => name.trim().toLocaleLowerCase() === entry.exerciseName.trim().toLocaleLowerCase();
    const matches = libraryCategories
      .filter((category) => !entry.category || category.title === entry.category)
      .flatMap((category) => category.exercises)
      .filter((exercise) => matchesName(exercise.title) || Boolean(exercise.translations?.nb?.title && matchesName(exercise.translations.nb.title)));
    const exercise = matches.length === 1 ? matches[0] : null;
    return (exercise ? (nb ? exercise.translations?.nb?.goal || exercise.goal : exercise.goal) : entry.summary) || (nb ? 'Ingen beskrivelse tilgjengelig for denne øvelsen ennå.' : 'No summary available for this exercise yet.');
  }
  async function save(entry: Entry) {
    const days = trainingScheduleDays(entry.day, entry.id ? 1 : repeatDays);
    if (!days || (days.length > 1 && entry.completed)) { setError(nb ? 'Velg 1–90 dager. Gjentatte øvelser må være planlagt.' : 'Choose 1–90 days. Repeated exercises must be scheduled.'); return; }
    if (preview) {
      setPreviewEntries((current) => entry.id ? current.map((item) => item.id === entry.id ? entry : item) : [...days.map((day, index) => ({ ...entry, day, id: crypto.randomUUID(), result: index === 0 ? entry.result : '', completed: days.length === 1 && entry.completed })), ...current]);
      setDay(entry.day); setDraft(null); setError(''); setNotice(entry.id ? 'This day updated in the calendar. Other scheduled days are unchanged. Preview resets on reload.' : 'Schedule added to the calendar. Preview resets on reload.'); return;
    }
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/customer/diary${entry.id ? `/${entry.id}` : ''}`, { method: entry.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...entry, repeatDays: entry.id ? 1 : repeatDays }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save entry.');
      setDraft(null); setNotice(nb ? `${data.count || 1} oppføring(er) lagret.` : `${data.count || 1} entry/entries saved.`); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save entry.'); }
    finally { setBusy(false); }
  }
  async function remove(entry: Entry) {
    if (!window.confirm(nb ? 'Slette øvelsen bare denne dagen? Andre dager beholdes.' : 'Delete this exercise for this day only? Other scheduled days will remain.')) return;
    if (preview) { setPreviewEntries((current) => current.filter((item) => item.id !== entry.id)); setDraft(null); setNotice('Exercise removed from this day in the calendar. Other scheduled days are unchanged.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/customer/diary/${entry.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(nb ? 'Kunne ikke slette oppføringen.' : 'Could not delete entry.');
      setDraft(null); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not delete entry.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6">
    <div role="group" aria-label={nb ? 'Treningsvisning' : 'Training view'} className="flex flex-wrap gap-2 rounded-2xl bg-brand-50 p-2">
      <button type="button" aria-pressed={view === 'diary'} className={`${button} ${view === 'diary' ? 'bg-brand-900 text-white' : 'bg-white'}`} onClick={() => setView('diary')}>{nb ? 'Kalender og øvelser' : 'Calendar & exercises'}</button>
      <button type="button" aria-pressed={view === 'stats'} className={`${button} ${view === 'stats' ? 'bg-brand-900 text-white' : 'bg-white'}`} onClick={() => setView('stats')}>{nb ? 'Treningsfremgang' : 'Training progress'}</button>
    </div>
    {view === 'stats' ? <div className="space-y-5"><TrainingStatsClient entries={entries} dogs={dogs} locale={locale} today={today()} /><button type="button" className={`${button} bg-brand-900 text-white`} onClick={() => setView('diary')}>{nb ? 'Tilbake til kalenderen' : 'Back to calendar & exercises'}</button></div> : <>

    <p className="text-brand-700">{nb ? 'Planlegg øvelser med varighet og repetisjoner, og kryss av når dere har trent.' : 'Plan exercises with duration and repetitions, then tick them off after training.'}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label>{nb ? 'Hund' : 'Dog'}<select className={input} value={dogId} onChange={(e) => { setDogId(e.target.value); setDraft(null); setOpenDay(null); }}>{dogs.map((dog) => <option key={dog.id} value={dog.id}>{dog.name}</option>)}</select></label>
      <label>{nb ? 'Dato' : 'Date'}<input type="date" required className={input} value={day} onChange={(e) => { setDay(e.target.value); setDraft(null); }} /></label>
    </div>
    <TrainingDiaryCalendar entries={entries.filter((entry) => entry.dogId === dogId)} day={day} locale={locale} onNavigate={(value) => { setDay(value); setHistory(false); setDraft(null); }} onSelect={(value) => { setDay(value); setHistory(false); setDraft(null); setOpenDay(value); }} />
    <dialog ref={dialogRef} onCancel={() => setOpenDay(null)} onClose={() => setOpenDay(null)} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpenDay(null); } }} aria-labelledby="diary-day-title" className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-brand-200 bg-white p-5 text-brand-900 shadow-xl backdrop:bg-black/40">
      <div className="flex items-start justify-between gap-3"><div><h2 id="diary-day-title" className="text-xl font-semibold">{openDay ? new Date(`${openDay}T12:00:00`).toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}</h2><p className="mt-1 text-sm text-brand-700">{dogs.find((dog) => dog.id === dogId)?.name} · {nb ? 'Planlagte øvelser' : 'Scheduled exercises'}</p></div><button type="button" className={button} onClick={() => setOpenDay(null)} aria-label={nb ? 'Lukk' : 'Close'}>✕</button></div>
      <p className="mt-4 text-sm">{nb ? 'Kryss av øvelsene når du har fullført dem.' : 'Tick each exercise when you have completed it.'}</p>
      {entries.some((entry) => entry.dogId === dogId && entry.day === openDay) ? <ul className="mt-4 space-y-3">{entries.filter((entry) => entry.dogId === dogId && entry.day === openDay).map((entry) => <li key={entry.id}><label className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border p-4 ${entry.completed ? 'border-emerald-200 bg-emerald-50' : 'border-brand-200'}`}><input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={entry.completed} disabled={busy} onChange={() => { void save({ ...entry, completed: !entry.completed }); }} /><span className="min-w-0"><span className="block break-words font-semibold">{entry.exerciseName}</span><span className="mt-1 block text-sm leading-6">{exerciseSummary(entry)}</span><span className="mt-1 block text-xs text-brand-700">{entry.minutes} min</span><span className="mt-1 block text-xs">{entry.completed ? (nb ? 'Fullført' : 'Completed') : (nb ? 'Planlagt' : 'Scheduled')}</span></span></label></li>)}</ul> : <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm">{nb ? 'Ingen øvelser planlagt denne dagen.' : 'No exercises scheduled for this day.'}</p>}
      {error ? <p className="mt-3 text-sm text-red-700" role="alert">{error}</p> : null}
      {notice ? <p className="mt-3 text-sm" role="status">{notice}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" className={`${button} bg-brand-900 text-white`} disabled={busy} onClick={() => { setOpenDay(null); setRepeatDays(1); setDraft(blank()); setError(''); setNotice(''); }}>{nb ? 'Legg til øvelse' : 'Add exercise'}</button><button type="button" className={button} onClick={() => setOpenDay(null)}>{nb ? 'Loggfør aktivitet' : 'Log Activity'}</button></div>
    </dialog>
    <h2 className="text-xl font-semibold">{history ? (nb ? 'Hele dagboken' : 'All diary entries') : new Date(`${day || today()}T12:00:00`).toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={button} onClick={() => setView('stats')}>{nb ? 'Se treningsfremgang' : 'View training progress'}</button>
      <button className={`${button} bg-brand-900 text-white`} disabled={!day || busy} onClick={() => { setRepeatDays(1); setDraft(blank()); setError(''); setNotice(''); }}>{nb ? 'Legg til øvelse' : 'Add exercise'}</button>
      <button className={button} onClick={() => setHistory(!history)}>{history ? (nb ? 'Vis valgt dag' : 'Show selected day') : (nb ? 'Vis hele dagboken' : 'Show all diary entries')}</button>
      <Link className="text-sm underline" href="/customer/training-library">{nb ? 'Åpne øvelsesbanken' : 'Browse exercise bank'}</Link>
    </div>
    {error ? <p role="alert" className="text-red-700">{error}</p> : null}
    {notice ? <p role="status">{notice}</p> : null}
    {draft ? <form className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-5" onSubmit={(e) => { e.preventDefault(); void save(draft); }}>
      <h2 className="text-lg font-semibold">{draft.id ? (nb ? 'Rediger oppføring' : 'Edit entry') : (nb ? 'Ny oppføring' : 'New entry')}</h2>
      <label className="block">{nb ? 'Velg fra øvelsesbanken' : 'Choose from the exercise bank'}<select className={input} disabled={loading} value="" onChange={(e) => { if (!e.target.value) return; const [ci, ei] = e.target.value.split(':').map(Number); const category = libraryCategories[ci]; const exercise = category.exercises[ei]; setDraft({ ...draft, exerciseName: nb ? exercise.translations?.nb?.title || exercise.title : exercise.title, category: category.title, summary: undefined }); }}><option value="">{nb ? 'Velg en øvelse eller skriv din egen nedenfor' : 'Choose an exercise or enter your own below'}</option>{libraryCategories.map((category, ci) => <optgroup key={category.title} label={nb ? category.translations?.nb?.title || category.title : category.title}>{category.exercises.map((exercise, ei) => <option key={exercise.title} value={`${ci}:${ei}`}>{nb ? exercise.translations?.nb?.title || exercise.title : exercise.title}</option>)}</optgroup>)}</select></label>
      {libraryError ? <p role="alert">{libraryError}</p> : null}
      <label className="block">{nb ? 'Øvelsens navn' : 'Exercise name'}<input className={input} required maxLength={200} value={draft.exerciseName} onChange={(e) => setDraft({ ...draft, exerciseName: e.target.value, category: null, summary: undefined })} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>{nb ? 'Dato' : 'Date'}<input className={input} type="date" required value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })} /></label>
        <label>{nb ? 'Varighet (minutter)' : 'Duration (minutes)'}<input className={input} type="number" min={1} max={1440} step={1} required value={draft.minutes || ''} onChange={(e) => setDraft({ ...draft, minutes: Number(e.target.value) })} /><span className="text-xs">{nb ? 'Planlagt tid før trening, faktisk tid etterpå.' : 'Planned time before training; actual time afterwards.'}</span></label>
      </div>
      <label className="block">{nb ? 'Antall repetisjoner' : 'Repetitions'}<input className={input} type="number" min={1} max={10000} step={1} value={draft.repetitions ?? ''} onChange={(e) => setDraft({ ...draft, repetitions: e.target.value ? Number(e.target.value) : null })} /><span className="text-xs">{nb ? 'Valgfritt. Antall ganger øvelsen gjøres denne dagen.' : 'Optional. Number of times to practise this exercise that day.'}</span></label>
      {!draft.id ? <label className="block">{nb ? 'Planlegg daglig i antall dager' : 'Schedule daily for this many days'}<input className={input} type="number" min={1} max={90} step={1} required value={repeatDays || ''} onChange={(e) => setRepeatDays(Number(e.target.value))} /><span className="text-xs">{nb ? 'Inkluderer valgt startdato. Hver dag kan redigeres separat.' : 'Includes the selected start date. Each day can be edited separately.'}</span>{repeatDays > 1 && trainingScheduleDays(draft.day, repeatDays) ? <p className="mt-2 font-semibold">{draft.day} → {trainingScheduleDays(draft.day, repeatDays)!.at(-1)} · {repeatDays} {nb ? 'daglige oppføringer' : 'daily entries'}</p> : null}</label> : null}
      <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={draft.completed} onChange={(e) => setDraft({ ...draft, completed: e.target.checked })} />{nb ? 'Fullført' : 'Completed'}</label>
      <div className="flex gap-3"><button disabled={busy} className={`${button} bg-brand-900 text-white`}>{busy ? (nb ? 'Lagrer…' : 'Saving…') : (nb ? 'Lagre' : 'Save entry')}</button><button className={button} disabled={busy} type="button" onClick={() => setDraft(null)}>{nb ? 'Avbryt' : 'Cancel'}</button></div>
    </form> : null}
    <p className="text-sm text-brand-700">{completed.length} / {visible.length} {nb ? 'fullført' : 'completed'} · {completed.reduce((sum, e) => sum + e.minutes, 0)} {nb ? 'minutter trent' : 'minutes trained'}</p>
    {!visible.length ? <p className="rounded-2xl border border-dashed border-brand-200 p-6">{nb ? 'Ingen øvelser ennå. Legg til en øvelse for å komme i gang.' : 'No exercises yet. Add an exercise to get started.'}</p> : <ul className="space-y-3">{visible.map((entry) => <li key={entry.id} className="rounded-2xl border border-brand-200 bg-white p-5">
      <div className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={entry.completed} disabled={busy} aria-label={`${nb ? 'Fullført' : 'Completed'}: ${entry.exerciseName}`} onChange={() => { void save({ ...entry, completed: !entry.completed }); }} /><div className="min-w-0 flex-1"><h3 className="break-words font-semibold">{entry.exerciseName}</h3><p className="mt-1 text-sm text-brand-700">{entry.day} · {entry.minutes} min{entry.repetitions ? ` · ${entry.repetitions} ${nb ? 'repetisjoner' : 'repetitions'}` : ''} · {entry.completed ? (nb ? 'Fullført' : 'Completed') : (nb ? 'Planlagt' : 'Scheduled')}</p></div></div>
      <div className="mt-3 flex gap-3"><button className={button} disabled={busy} onClick={() => { setDraft(entry); setError(''); }}>{nb ? 'Rediger denne dagen' : 'Edit this day'}</button><button className={button} disabled={busy} onClick={() => void remove(entry)}>{nb ? 'Slett denne dagen' : 'Delete this day'}</button></div>
    </li>)}</ul>}
    </>}
  </div>;
}
