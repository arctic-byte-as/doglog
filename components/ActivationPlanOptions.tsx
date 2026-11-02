'use client';

import { useId, useState } from 'react';
import { activationOptions, formatActivationOption } from '@/lib/activation-options';

export default function ActivationPlanOptions({ plan, onChange }: { plan: string; onChange: (plan: string) => void }) {
  const id = useId();
  const [selected, setSelected] = useState('');
  const [notice, setNotice] = useState('');
  const activity = activationOptions.find((option) => option.label === selected);
  const entry = activity ? formatActivationOption(activity) : '';
  const alreadyAdded = Boolean(entry && plan.split('\n').includes(`Activity: ${activity?.label}`));

  function addActivity() {
    if (!activity || !entry || alreadyAdded) return;
    onChange(plan ? `${plan}\n\n---\n\n${entry}` : entry);
    setNotice(`${activity.label} added to the training plan. Save the consultation or session to keep it.`);
    setSelected('');
  }

  return (
    <details className="min-w-0 w-full sm:w-72">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 [&::-webkit-details-marker]:hidden">Add activation activity <span aria-hidden="true" className="ml-2">▾</span></summary>
      <div className="mt-3 min-w-0 space-y-3 rounded-xl border border-brand-200 bg-white p-3">
      <label htmlFor={id} className="block text-sm font-medium">Activation activities for the plan (optional)</label>
      <p id={`${id}-help`} className="text-sm leading-6">Choose an activity to add to the prescribed plan.</p>
      <div className="flex min-w-0 flex-wrap items-start gap-3">
        <select id={id} aria-describedby={`${id}-help`} value={selected} onChange={(event) => { setSelected(event.target.value); setNotice(''); }} className="min-h-11 min-w-0 flex-[1_1_12rem] rounded-lg border border-brand-200 bg-white p-3 text-base">
          <option value="">Choose an activation activity</option>
          {activationOptions.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
        </select>
        <button type="button" onClick={addActivity} disabled={!activity || alreadyAdded} className="min-h-11 shrink-0 grow rounded-lg bg-brand-700 px-4 py-3 text-white disabled:opacity-50">Add to plan</button>
      </div>
      {activity ? <details className="rounded-lg border border-brand-200 p-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">How to do {activity.label.toLowerCase()}</summary><p className="mt-2 text-sm leading-6">{activity.description}</p><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">{activity.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><p className="mt-3 text-sm leading-6"><strong>Time and frequency:</strong> {activity.timing}</p><p className="mt-3 text-sm leading-6"><strong>Expected outcome:</strong> {activity.outcome}</p></details> : null}
      <p role="status" className="break-words text-sm leading-6">{alreadyAdded ? 'This activity is already in the plan.' : notice}</p>
      </div>
    </details>
  );
}
