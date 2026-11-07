'use client';

import { useState } from 'react';
import { summarizeTraining, trainingEncouragement, type StatsEntry } from '@/lib/training-stats';

export default function TrainingStatsClient({ entries, dogs, today, locale = 'en' }: { entries: StatsEntry[]; dogs: { id: string; name: string }[]; today: string; locale?: 'en' | 'nb' }) {
  const nb = locale === 'nb';
  const [dog, setDog] = useState('all');
  const [period, setPeriod] = useState('week');
  function offset(value: number) { const date = new Date(`${today}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + value); return date.toISOString().slice(0, 10); }
  const start = offset(period === 'week' ? -6 : -29);
  const selected = entries.filter((entry) => (dog === 'all' || entry.dogId === dog) && (period === 'all' || (entry.day >= start && entry.day <= today)));
  const stats = summarizeTraining(selected, today);
  const encouragement = trainingEncouragement(selected, today, locale);
  const upcoming = entries.filter((entry) => (dog === 'all' || entry.dogId === dog) && !entry.completed && entry.day > today).length;
  const days = Array.from({ length: 7 }, (_, i) => offset(i - 6));
  const bars = days.map((day) => ({ day, total: selected.filter((entry) => entry.day === day).length, done: selected.filter((entry) => entry.day === day && entry.completed).length }));
  const max = Math.max(1, ...bars.map((bar) => bar.total));
  const exercises = [...new Set(selected.map((entry) => entry.exerciseName))].map((name) => ({ name, total: selected.filter((entry) => entry.exerciseName === name).length, done: selected.filter((entry) => entry.exerciseName === name && entry.completed).length })).sort((a, b) => b.done - a.done || a.name.localeCompare(b.name));
  const green = stats.total ? stats.completed / stats.total * 100 : 0;
  const amber = stats.total ? (stats.completed + stats.pending) / stats.total * 100 : 0;
  const card = 'rounded-2xl border border-brand-200 bg-white p-5';
  return <div className="space-y-6">

    <div className="flex flex-wrap gap-4"><label className="text-sm font-semibold">{nb ? 'Hund' : 'Dog'}<select className="ml-2 min-h-11 rounded-xl border border-brand-200 bg-white px-3" value={dog} onChange={(e) => setDog(e.target.value)}><option value="all">{nb ? 'Alle hunder' : 'All dogs'}</option>{dogs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm font-semibold">{nb ? 'Periode' : 'Period'}<select className="ml-2 min-h-11 rounded-xl border border-brand-200 bg-white px-3" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="week">{nb ? 'Siste 7 dager' : 'Last 7 days'}</option><option value="month">{nb ? 'Siste 30 dager' : 'Last 30 days'}</option><option value="all">{nb ? 'Hele planen' : 'Entire plan'}</option></select></label></div>
    <section aria-labelledby="training-encouragement-heading" className="rounded-2xl border border-brand-200 bg-brand-50 p-6" aria-live="polite">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{nb ? 'Din treningsoppsummering' : 'Your training check-in'}</p>
      <h2 id="training-encouragement-heading" className="mt-2 text-2xl font-semibold">{encouragement.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7">{encouragement.body}</p>
      <p className="mt-4 text-xs leading-5 text-brand-700">{encouragement.due ? `${encouragement.done} / ${encouragement.due} ${nb ? 'øvelser fullført før i dag i valgt periode.' : 'exercises completed before today in the selected period.'} ` : ''}{nb ? 'Oppdateres automatisk fra dagboken. Dagens og fremtidige øvelser regnes ikke som forsinket.' : 'Updates automatically from your diary. Today’s and future exercises are not counted as behind schedule.'}</p>
    </section>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[
      [stats.total, nb ? 'Planlagte øvelser totalt' : 'Total planned exercises'], [stats.completed, nb ? 'Fullførte øvelser' : 'Completed exercises'], [stats.minutes, nb ? 'Minutter fullført' : 'Minutes completed'], [stats.activeDays, nb ? 'Dager med trening' : 'Days with training'],
    ].map(([value, label]) => <div key={label} className={card}><p className="text-3xl font-semibold">{value}</p><p className="mt-2 text-sm text-brand-700">{label}</p></div>)}</div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={card}><h3 className="text-lg font-semibold">{nb ? 'Treningsplanen din' : 'Your training plan'}</h3><div className="mt-5 flex flex-wrap items-center justify-center gap-6"><div role="img" aria-label={`${stats.percent}% ${nb ? 'fullført' : 'complete'}`} className="flex h-48 w-48 shrink-0 items-center justify-center rounded-full" style={{ background: stats.total ? `conic-gradient(#047857 0% ${green}%, #fbbf24 ${green}% ${amber}%, #cbd5e1 ${amber}% 100%)` : '#e2e8f0' }}><div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white"><strong className="text-4xl">{stats.percent}%</strong><span className="mt-1 text-sm">{nb ? 'fullført' : 'complete'}</span></div></div><ul className="space-y-3 text-sm">{[[stats.completed, nb ? 'Fullført' : 'Completed', '#047857'], [stats.pending, nb ? 'Gjenstår til i dag' : 'Remaining through today', '#fbbf24'], [stats.upcoming, nb ? 'Planlagt fremover' : 'Scheduled ahead', '#cbd5e1']].map(([value, label, color]) => <li key={label} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: String(color) }} /><span>{label}: <strong>{value}</strong></span></li>)}</ul></div><p className="mt-5 text-sm text-brand-700">{stats.total ? `${stats.completed} / ${stats.total} ${nb ? 'øvelser fullført i valgt periode.' : 'exercises completed in the selected period.'}` : (nb ? 'Ingen øvelser i denne perioden ennå.' : 'No exercises in this period yet.')}</p></section>
      <section className={card}><h3 className="text-lg font-semibold">{nb ? 'En liten innsats hver dag' : 'A little practice each day'}</h3><p className="mt-1 text-sm text-brand-700">{nb ? 'Siste 7 dager · antall øvelser' : 'Last 7 days · exercise count'}</p><div className="mt-6 grid grid-cols-7 gap-2">{bars.map((bar) => <div key={bar.day} className="text-center"><span className="text-xs">{bar.done}/{bar.total}</span><div role="img" aria-label={`${bar.day}: ${bar.done}/${bar.total} ${nb ? 'fullført' : 'completed'}`} className="mt-2 flex h-36 items-end justify-center"><div className="relative w-full max-w-10 overflow-hidden rounded-t-lg bg-amber-100" style={{ height: `${bar.total / max * 100}%`, minHeight: 3 }}><div className="absolute bottom-0 w-full bg-emerald-700" style={{ height: `${bar.total ? bar.done / bar.total * 100 : 0}%` }} /></div></div><span className="mt-2 block text-xs">{new Date(`${bar.day}T12:00:00`).toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { weekday: 'short' })}</span></div>)}</div><p className="mt-5 text-xs text-brand-700">{nb ? 'Grønn: fullført · Lys: gjenstår · Tall: fullført / planlagt' : 'Green: completed · Light: remaining · Counts: completed / planned'}</p></section>
    </div>
    <section className={card}><h3 className="text-lg font-semibold">{nb ? 'Steg for steg, øvelse for øvelse' : 'Progress, exercise by exercise'}</h3>{exercises.length ? <ul className="mt-4 space-y-4">{exercises.map((exercise) => <li key={exercise.name}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="font-semibold">{exercise.name}</span><span>{exercise.done}/{exercise.total}</span></div><div role="progressbar" aria-label={exercise.name} aria-valuemin={0} aria-valuemax={exercise.total} aria-valuenow={exercise.done} className="h-2 overflow-hidden rounded-full bg-brand-100"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${exercise.done / exercise.total * 100}%` }} /></div></li>)}</ul> : <p className="mt-3 text-sm">{nb ? 'Legg til en øvelse i dagboken for å komme i gang.' : 'Add an exercise to your diary to get started.'}</p>}</section>
    <p className="text-sm text-brand-700">{upcoming} {nb ? 'øvelser planlagt fremover. Minutter er varigheten registrert på fullførte oppføringer.' : 'exercises scheduled ahead. Minutes use the duration recorded on completed entries.'}</p>
  </div>;
}
