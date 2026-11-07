'use client';

import { useId, useState } from 'react';
import type { Category } from '@/lib/training-library';
import { findDiaryExercise } from '@/lib/diary-exercise';

export default function DiaryExerciseInstructions({ categories, entry, locale, libraryHref, loading }: { categories: Category[]; entry: { exerciseName: string; category: string | null }; locale: 'en' | 'nb'; libraryHref: string; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const nb = locale === 'nb';
  const match = findDiaryExercise(categories, entry);
  const exercise = match?.exercise;
  const translation = nb ? exercise?.translations?.nb : undefined;
  const href = match ? `${libraryHref}?${new URLSearchParams({ category: match.category.title, exercise: match.exercise.title })}` : libraryHref;
  return <div className="mt-3">
    <button type="button" disabled={loading} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-950 disabled:opacity-60">{nb ? 'Slik gjør du øvelsen' : 'How to do this exercise'}<span aria-hidden="true">{open ? '−' : '+'}</span></button>
    {open ? <section id={id} aria-label={`${nb ? 'Veiledning' : 'Instructions'}: ${entry.exerciseName}`} className="mt-3 space-y-4 rounded-xl border border-brand-200 bg-white p-4 text-sm leading-6">
      {exercise ? <>
        <p>{translation?.goal || exercise.goal}</p>
        <div><h4 className="font-semibold">{nb ? 'Forberedelser' : 'Setup'}</h4><ul className="mt-2 list-disc space-y-1 pl-5">{(translation?.setup || exercise.setup).map((line, index) => <li key={index}>{line}</li>)}</ul></div>
        <div><h4 className="font-semibold">{nb ? 'Steg for steg' : 'Step by step'}</h4><ol className="mt-2 list-decimal space-y-2 pl-5">{(translation?.steps || exercise.steps).map((line, index) => <li key={index}>{line}</li>)}</ol></div>
        <div><h4 className="font-semibold">{nb ? 'Tegn på fremgang' : 'Progress marker'}</h4><p className="mt-1">{translation?.progress || exercise.progress}</p></div>
        <div><h4 className="font-semibold">{nb ? 'Unngå' : 'Avoid'}</h4><p className="mt-1">{translation?.avoid || exercise.avoid}</p></div>
      </> : <p>{nb ? 'Denne øvelsen er ikke koblet til en entydig veiledning i øvelsesbanken. Be treneren din om instruksjoner.' : 'This exercise is not linked to a unique guide in the exercise bank. Ask your trainer for instructions.'}</p>}
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{nb ? 'Åpne i øvelsesbanken (ny fane)' : 'Open exercise bank (new tab)'} ↗</a>
    </section> : null}
  </div>;
}
