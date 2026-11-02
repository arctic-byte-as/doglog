'use client';
import { useId, useState } from 'react';
import { developmentNote, readDevelopment, writeDevelopment } from '@/lib/dog-development';

export default function DogDevelopmentEditor({ plan, onChange, profileAge }: { plan: string; onChange: (plan: string) => void; profileAge?: string }) {
  const id = useId();
  const data = readDevelopment(plan);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  function select(key: 'months' | 'sex' | 'status', value: string) {
    const next = { ...data, [key]: value };
    const previousSuggestion = developmentNote(data.months, data.sex, data.status);
    next.note = !data.note || data.note === previousSuggestion ? developmentNote(next.months, next.sex, next.status) : data.note;
    setNoteDraft(null);
    onChange(writeDevelopment(plan, next));
  }
  const style = 'min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base';
  return <section className="min-w-0 space-y-3 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5">
    <h3 className="text-sm font-semibold">Age and development at consultation</h3>
    {profileAge ? <p className="text-sm text-brand-700">Dog profile age: {profileAge}. Confirm the age for this consultation below.</p> : null}
    <label htmlFor={`${id}-age`} className="block text-sm font-medium">Age in months</label>
    <select id={`${id}-age`} value={data.months} onChange={(event) => select('months', event.target.value)} className={style}><option value="">Unknown / not recorded</option>{Array.from({ length: 361 }, (_, age) => <option key={age} value={String(age)}>{age} {age === 1 ? 'month' : 'months'}{age >= 12 ? ` (${Math.floor(age / 12)} ${Math.floor(age / 12) === 1 ? 'year' : 'years'}${age % 12 ? ` ${age % 12} months` : ''})` : ''}</option>)}</select>
    <label htmlFor={`${id}-sex`} className="block text-sm font-medium">Sex</label><select id={`${id}-sex`} value={data.sex} onChange={(event) => select('sex', event.target.value)} className={style}><option value="">Unknown / not recorded</option><option>Male</option><option>Female</option></select>
    <label htmlFor={`${id}-status`} className="block text-sm font-medium">Neuter status</label><select id={`${id}-status`} value={data.status} onChange={(event) => select('status', event.target.value)} className={style}><option value="">Unknown / not recorded</option><option>Intact</option><option>Neutered</option></select>
    <p id={`${id}-help`} className="text-sm leading-5 text-brand-700">Selecting age, sex or neuter status updates the suggested note. Your personalised wording is preserved. Review before saving; prescribed exercises stay as selected.</p>
    <button type="button" onClick={() => { if (data.note && !window.confirm('Replace the development note with a fresh suggestion?')) return; setNoteDraft(null); onChange(writeDevelopment(plan, { ...data, note: developmentNote(data.months, data.sex, data.status) })); }} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm">Generate suggested note</button>
    <label htmlFor={`${id}-note`} className="block text-sm font-medium">Development note</label><textarea id={`${id}-note`} aria-describedby={`${id}-help`} rows={7} value={noteDraft ?? data.note} onChange={(event) => { setNoteDraft(event.target.value); onChange(writeDevelopment(plan, { ...data, note: event.target.value })); }} onBlur={() => setNoteDraft(null)} className={style} />
  </section>;
}
