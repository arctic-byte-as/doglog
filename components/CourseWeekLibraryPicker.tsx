'use client';
import { useState } from 'react';
import type { Category } from '@/lib/training-library';
import type { CourseLibraryExercise } from '@/lib/course-templates';
import CourseLibraryExercises from './CourseLibraryExercises';

export default function CourseWeekLibraryPicker({ categories, selected, onChange, loading, error }: {
  categories: Category[]; selected: CourseLibraryExercise[]; onChange: (items: CourseLibraryExercise[]) => void; loading: boolean; error: string;
}) {
  const [search, setSearch] = useState(''), [category, setCategory] = useState('');
  const input = 'mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2';
  const matches = categories.filter(item => !category || item.title === category).flatMap(item => item.exercises.filter(exercise => `${exercise.title} ${exercise.goal} ${item.title}`.toLowerCase().includes(search.trim().toLowerCase())).map(exercise => ({ category: item.title, exercise })));
  return <section className="space-y-3 rounded-xl border border-brand-200 bg-white p-4">
    <h4 className="font-semibold">Training library exercises</h4>
    <p className="text-sm text-brand-700">Choose the same exercises used in training plans. Names, categories and instructions are saved with this course; later library edits won’t change a scheduled course.</p>
    {selected.length ? <div className="space-y-2">{selected.map((item, index) => <div key={`${item.category}:${item.exercise.title}`} className="rounded-xl bg-brand-50 p-3"><CourseLibraryExercises exercises={[item]} /><button type="button" className="mt-2 min-h-11 text-sm font-semibold underline" onClick={() => onChange(selected.filter((_, i) => i !== index))}>Remove {item.exercise.title}</button></div>)}</div> : <p className="text-sm">No library exercises selected for this week yet.</p>}
    <details><summary className="min-h-11 cursor-pointer py-2 font-semibold">+ Add from training library ({selected.length}/20)</summary>
      {loading ? <p role="status">Loading training library…</p> : error ? <p role="alert" className="text-sm text-red-700">{error}</p> : <>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Search exercises<input type="search" className={input} value={search} onChange={event => setSearch(event.target.value)} placeholder="Exercise name or goal" /></label><label className="text-sm font-semibold">Category<select className={input} value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(item => <option key={item.title}>{item.title}</option>)}</select></label></div>
        <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">{!matches.length ? <p className="text-sm">No matching exercises.</p> : matches.map(item => {
          const added = selected.some(existing => existing.category === item.category && existing.exercise.title === item.exercise.title);
          return <article key={`${item.category}:${item.exercise.title}`} className="rounded-xl border border-brand-200 p-3"><p className="font-semibold">{item.exercise.title}</p><p className="text-xs text-brand-700">{item.category}</p><p className="mt-1 text-sm">{item.exercise.goal}</p><button type="button" disabled={added || selected.length >= 20} className="mt-2 min-h-11 rounded-full border border-brand-200 px-4 text-sm font-semibold disabled:opacity-50" onClick={() => onChange([...selected, { category: item.category, exercise: structuredClone(item.exercise) }])}>{added ? 'Added to this week' : 'Add exercise'}</button></article>;
        })}</div>
      </>}
    </details>
  </section>;
}
