'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { exerciseIsInPlan, formatTrainingExercise } from '@/lib/training-library';
import { useTrainingLibrary } from '@/lib/use-training-library';

export default function TrainingExercisePicker({ plan, onChange }: { plan: string; onChange: (plan: string) => void }) {
  const { libraryCategories, loading, error, localOnly } = useTrainingLibrary();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const searchId = useId();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const triggerElement = trigger.current;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; triggerElement?.focus(); };
  }, [open]);

  const exercises = libraryCategories.flatMap((group) => group.exercises.map((exercise) => ({
    category: group.title, exercise, key: JSON.stringify([group.title, exercise.title]),
    added: exerciseIsInPlan(plan, group.title, exercise),
  })));
  const query = search.trim().toLowerCase();
  const visible = exercises.filter((item) => (!category || item.category === category) && (!query || `${item.category} ${item.exercise.title} ${item.exercise.goal}`.toLowerCase().includes(query)));
  const choices = exercises.filter((item) => selected.includes(item.key) && !item.added);

  function addExercises() {
    if (!choices.length) return;
    const blocks = choices.map((item) => formatTrainingExercise(item.category, item.exercise));
    onChange([plan.trim(), ...blocks].filter(Boolean).join('\n\n---\n\n'));
    setNotice(`${choices.length} ${choices.length === 1 ? 'exercise added' : 'exercises added'} to the plan. Save the session to keep your changes.`);
    setSelected([]);
    setOpen(false);
  }

  return <>
    <button ref={trigger} type="button" onClick={() => { setSelected([]); setSearch(''); setCategory(''); setOpen(true); }} className="rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800">Add exercises from library</button>
    <p role="status" className="text-sm text-brand-700">{notice}</p>
    {open ? <dialog ref={dialog} aria-labelledby={headingId} onClose={() => setOpen(false)} className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-white p-0 text-brand-950 backdrop:bg-black/50 sm:m-auto sm:h-[90dvh] sm:max-h-[900px] sm:w-[94vw] sm:max-w-7xl sm:rounded-3xl">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-brand-100 p-4 sm:p-6">
          <div><h2 id={headingId} className="text-2xl font-semibold">Choose training exercises</h2><p className="mt-1 text-sm text-brand-700">Browse a category or search the library. Add several exercises together.</p></div>
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-brand-200 px-3 py-2 text-sm">Close</button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <label htmlFor={searchId} className="text-sm font-semibold">Search all categories</label>
          <input id={searchId} type="search" autoFocus placeholder="Search exercises, goals or categories…" value={search} onChange={(event) => { setSearch(event.target.value); setCategory(''); }} className="mt-2 w-full rounded-xl border border-brand-200 p-3" />
          {loading ? <p role="status" className="mt-6">Loading training library…</p> : error ? <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-800">{error}</p> : <>
            {localOnly ? <p className="mt-4 text-sm text-brand-700">Includes this browser’s saved exercises. Save the shared library on the Training Library page to use them on other devices.</p> : null}
            <h3 className="mb-3 mt-6 font-semibold">Categories</h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[{ title: '', summary: 'Browse the complete training library.', count: exercises.length }, ...libraryCategories.map((group) => ({ title: group.title, summary: group.summary, count: group.exercises.length }))].map((group) => <button key={group.title} type="button" aria-pressed={category === group.title} onClick={() => setCategory(group.title)} className={`rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${category === group.title ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-brand-200 bg-white hover:border-brand-500'}`}>
                <span className="block font-semibold">{group.title || 'All categories'}</span><span className="mt-1 block text-xs font-medium text-brand-700">{group.count} {group.count === 1 ? 'exercise' : 'exercises'}</span><span className="mt-2 hidden text-sm text-brand-700 sm:block">{group.summary}</span>
              </button>)}
            </div>
            <div className="mb-3 mt-7 flex items-center justify-between"><h3 className="font-semibold">{category || 'All exercises'}</h3><span className="text-sm text-brand-700" role="status">{visible.length} {visible.length === 1 ? 'result' : 'results'}</span></div>
            {!visible.length ? <div className="rounded-2xl border border-dashed border-brand-200 p-6"><p>No exercises found. Try a different search or category.</p><button type="button" onClick={() => { setSearch(''); setCategory(''); }} className="mt-3 font-semibold underline">Clear filters</button></div> : null}
            <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => <article key={item.key} className={`min-w-0 rounded-2xl border p-5 ${selected.includes(item.key) ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-brand-200 bg-white'}`}>
                <p className="text-xs font-medium text-brand-700">{item.category}</p><h4 className="mt-2 text-lg font-semibold">{item.exercise.title}</h4><p className="mt-2 text-sm leading-6 text-brand-700">{item.exercise.goal}</p>
                <label className={`mt-4 flex items-center gap-3 rounded-lg border border-brand-200 p-3 text-sm font-semibold ${item.added ? 'bg-brand-50 text-brand-700' : 'cursor-pointer'}`}><input type="checkbox" disabled={item.added} checked={item.added || selected.includes(item.key)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item.key] : current.filter((key) => key !== item.key))} aria-label={`Select ${item.exercise.title}`} className="h-4 w-4 accent-brand-700" />{item.added ? 'Already in plan' : selected.includes(item.key) ? 'Selected' : 'Select exercise'}</label>
                <details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold text-brand-800">View instructions</summary><div className="mt-3 space-y-3 leading-6"><div><h5 className="font-semibold">Setup</h5><ul className="list-disc pl-5">{item.exercise.setup.map((line, i) => <li key={i}>{line}</li>)}</ul></div><div><h5 className="font-semibold">Steps</h5><ol className="list-decimal pl-5">{item.exercise.steps.map((line, i) => <li key={i}>{line}</li>)}</ol></div><p><strong>Progress marker:</strong> {item.exercise.progress}</p><p><strong>Avoid:</strong> {item.exercise.avoid}</p></div></details>
              </article>)}
            </div>
          </>}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 bg-white p-4 sm:p-6">
          <div><p className="font-semibold" role="status">{choices.length} selected</p><p className="text-xs text-brand-700">Your existing plan and notes will be kept.</p></div>
          <div className="flex gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm">Cancel</button><button type="button" disabled={!choices.length || loading || Boolean(error)} onClick={addExercises} className="rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Add {choices.length || ''} {choices.length === 1 ? 'exercise' : 'exercises'} to plan</button></div>
        </footer>
      </div>
    </dialog> : null}
  </>;
}
