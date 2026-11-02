'use client';
import { useId, useState } from 'react';
import BreedSelect from '@/components/BreedSelect';
import { isMixedBreed, mixedBreedParts, formatMixedBreed } from '@/lib/mixed-breeds';
export default function MixedBreedSelect({ id, value, onChange }: { id?: string; value: string; onChange: (value: string) => void }) {
  const generatedId = useId();
  const [nextBreed, setNextBreed] = useState('');
  const controlId = id || generatedId;
  if (!isMixedBreed(value)) return <BreedSelect id={controlId} value={value} onChange={onChange} allowMixed />;
  const parts = mixedBreedParts(value);
  return <div className="min-w-0 space-y-3">
    <select id={controlId} value="mixed" onChange={() => onChange('')} className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base"><option value="mixed">Mixed breed</option><option value="single">Choose a single breed instead</option></select>
    <p className="text-sm leading-6">Select the known or reported breeds. These are starting points, not confirmation of ancestry or inherited traits. Selecting a breed from the list updates the guidance immediately. For a custom name, type it and use Add breed. Personalise the guidance before saving.</p>
    {parts.map((breed, index) => <div key={index} className="space-y-2"><p className="text-sm font-medium">Breed {index + 1}</p><div className="flex min-w-0 items-start gap-2"><div className="min-w-0 flex-1"><p className="min-h-11 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-base">{breed}</p></div><button type="button" aria-label={`Remove breed ${index + 1}: ${breed}`} onClick={() => onChange(formatMixedBreed(parts.filter((_, position) => position !== index)))} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm">Remove</button></div></div>)}
    {parts.length ? <p role="status" className="text-sm font-medium">Guidance includes: {parts.join(' + ')}</p> : <p role="status" className="text-sm font-medium">Choose the contributing breeds below to generate mixed-breed descriptions.</p>}
    <label htmlFor={`${controlId}-add`} className="block text-sm font-medium">{parts.length ? 'Add another breed' : 'Choose the first breed'}</label>
    <BreedSelect key={parts.length} id={`${controlId}-add`} value={nextBreed} onChange={setNextBreed} onSelectBreed={(next) => { onChange(formatMixedBreed([...parts, next])); setNextBreed(''); }} />
    <button type="button" disabled={!nextBreed.trim() || parts.some((part) => part.toLowerCase() === nextBreed.trim().toLowerCase())} onClick={() => { onChange(formatMixedBreed([...parts, nextBreed])); setNextBreed(''); }} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm disabled:opacity-50">Add breed</button>
  </div>;
}
