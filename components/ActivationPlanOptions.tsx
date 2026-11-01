'use client';

import { useId, useState } from 'react';
import { activationOptions, formatActivationOption } from '@/lib/activation-options';

export default function ActivationPlanOptions({ plan, onChange }: { plan: string; onChange: (plan: string) => void }) {
  const id = useId();
  const [selected, setSelected] = useState('');
  const [notice, setNotice] = useState('');
  const activity = activationOptions.find((option) => option.label === selected);
  const entry = activity ? `Activation: ${formatActivationOption(activity)}` : '';
  const alreadyAdded = Boolean(entry && plan.split('\n').includes(entry));

  function addActivity() {
    if (!activity || !entry || alreadyAdded) return;
    onChange(plan ? `${plan}\n\n${entry}` : entry);
    setNotice(`${activity.label} added to the training plan. Save the consultation or session to keep it.`);
    setSelected('');
  }

  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">Activation activities for the plan (optional)</label>
      <p id={`${id}-help`} className="text-sm leading-6">Choose an activity to add to the prescribed plan.</p>
      <div className="flex min-w-0 flex-wrap items-start gap-3">
        <select id={id} aria-describedby={`${id}-help`} value={selected} onChange={(event) => { setSelected(event.target.value); setNotice(''); }} className="min-h-11 min-w-0 flex-[1_1_12rem] rounded-lg border border-brand-200 bg-white p-3 text-base">
          <option value="">Choose an activation activity</option>
          {activationOptions.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
        </select>
        <button type="button" onClick={addActivity} disabled={!activity || alreadyAdded} className="min-h-11 shrink-0 grow rounded-lg bg-brand-700 px-4 py-3 text-white disabled:opacity-50">Add to plan</button>
      </div>
      {activity ? <p className="break-words text-sm leading-6">{activity.description}</p> : null}
      <p role="status" className="break-words text-sm leading-6">{alreadyAdded ? 'This activity is already in the plan.' : notice}</p>
    </div>
  );
}
