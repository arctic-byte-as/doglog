'use client';
import { useId, useState } from 'react';
import { agreementLabels, agreementValue, updateAgreement } from '@/lib/training-agreement';

export default function TrainingAgreementEditor({ plan, onChange }: { plan: string; onChange: (plan: string) => void }) {
  const id = useId();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  return <section className="min-w-0 space-y-4 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5">
    <h3 className="text-sm font-semibold">What we agreed</h3>
    <p className="text-sm leading-6 text-brand-700">Describe the problem and goal for this dog. Personalise the training steps below, then save the consultation.</p>
    {agreementLabels.map((label, index) => <div key={label} className="space-y-2"><label htmlFor={`${id}-${index}`} className="block text-sm font-medium">{label === 'Agreed problem' ? 'What we agreed to work on' : 'Our goal'}</label><textarea id={`${id}-${index}`} rows={3} value={drafts[label] ?? agreementValue(plan, label)} placeholder={index === 0 ? 'For example: Luna jumps up when visitors arrive at the front door.' : 'For example: Luna greets visitors with four paws on the floor.'} onChange={(event) => { const text = event.target.value; setDrafts((current) => ({ ...current, [label]: text })); onChange(updateAgreement(plan, label, text)); }} onBlur={() => setDrafts((current) => { const next = { ...current }; delete next[label]; return next; })} className="min-h-11 w-full min-w-0 resize-y rounded-lg border border-brand-200 bg-white p-3 text-base" /></div>)}
  </section>;
}
