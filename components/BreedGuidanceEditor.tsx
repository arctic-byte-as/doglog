'use client';
import { useId, useState } from 'react';
import { defaultBreedGuidance, readBreedGuidance, writeBreedGuidance, refreshMixedBreedGuidance } from '@/lib/breed-guidance';
export default function BreedGuidanceEditor({ breed, plan, onChange }: { breed: string; plan: string; onChange: (plan: string) => void }) {
  const id = useId();
  const saved = readBreedGuidance(plan);
  const guidance = saved ? refreshMixedBreedGuidance(saved) : defaultBreedGuidance(breed);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const mixed = /^Mixed breed(?::|$)/i.test(breed);
  const labels = { purpose: 'Original purpose', traits: 'Common traits', activation: 'Breed-specific activity ideas', temperament: 'Temperament tendencies' };
  return <details open={mixed || undefined} className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5">
    <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Breed guidance{guidance.breed ? `: ${guidance.breed}` : ''}</summary>
    <div className="min-w-0 space-y-3 pt-3">
      <p className="text-sm leading-5 text-brand-700">General breed context, not a prediction of this dog’s personality. Review against the individual dog, age and health. All fields can be personalised.</p>
      {mixed && !breed.includes(':') ? <p role="status" className="text-sm font-medium">Select contributing breeds under Dog Breed to fill the descriptions here.</p> : null}
      {saved && saved.breed.trim().toLowerCase() !== breed.trim().toLowerCase() ? <p role="status" className="text-sm font-medium">These notes describe {saved.breed || 'an unspecified breed'}. The selected breed is now {breed || 'not recorded'}. Your notes have been kept; load new suggestions only if wanted.</p> : null}
      {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => <div key={key} className="space-y-2"><label htmlFor={`${id}-${key}`} className="block text-sm font-medium">{labels[key]}</label><textarea id={`${id}-${key}`} rows={3} value={drafts[key] ?? guidance[key]} onChange={(event) => { setDrafts((current) => ({ ...current, [key]: event.target.value })); onChange(writeBreedGuidance(plan, { ...guidance, [key]: event.target.value })); }} onBlur={() => setDrafts((current) => { const next = { ...current }; delete next[key]; return next; })} className="min-h-11 w-full min-w-0 resize-y rounded-lg border border-brand-200 bg-white p-3 text-base" /></div>)}
      {guidance.sources.length ? <p className="text-sm leading-5">Profile sources: {guidance.sources.map((source, index) => <span key={source.url}>{index ? ', ' : ''}<a className="underline" href={source.url}>{source.title}</a></span>)}</p> : <p className="text-sm leading-5">No verified profile for this breed name yet. Add individual guidance above.</p>}
      <button type="button" onClick={() => { if (saved && !window.confirm('Replace all breed guidance with suggestions for the selected breed?')) return; setDrafts({}); onChange(writeBreedGuidance(plan, defaultBreedGuidance(breed))); }} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm">Load suggestions for selected breed</button>
    </div>
  </details>;
}
