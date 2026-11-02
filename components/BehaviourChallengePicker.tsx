'use client';

import { useId, useState } from 'react';
import { seedAgreement } from '@/lib/training-agreement';
import TrainingExercisePicker from '@/components/TrainingExercisePicker';
import { appendPlanText, behaviourGuides, behaviourGuideSources, behaviourChallenges } from '@/lib/behaviour-challenges';

export default function BehaviourChallengePicker({ plan, onChange }: { plan: string; onChange: (plan: string) => void }) {
  const id = useId();
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const [notice, setNotice] = useState('');
  const saved = plan.split('\n').filter((line) => line.startsWith('Behaviour challenge: ')).map((line) => line.slice('Behaviour challenge: '.length));
  const options = [...new Set([...behaviourChallenges, ...saved])];
  let customOption = 'custom';
  while (options.includes(customOption)) customOption += '_';
  const challenge = selected === customOption ? custom.trim().replace(/[\r\n]+/g, ' ') : selected;
  const goals = [
    'Notice arrivals and outside noises, then turn back to the owner or settle more easily.',
    'Feel more comfortable around everyday sounds and recover more easily.',
    'Greet people with four paws on the floor.',
    'Notice other dogs at a comfortable distance and move away calmly.',
    'Remain comfortable around unfamiliar people, with space to move away.',
    'Return promptly when called in the situations practised.',
    'Turn away from items when asked and willingly exchange held toys.',
    'Rest comfortably during short, carefully built absences.',
    'Walk comfortably with a loose lead and regular sniffing breaks.',
    'Settle comfortably and rest for longer when needs have been met.',
  ];
  const goal = goals[behaviourChallenges.indexOf(challenge)] || '';
  const guide = Object.prototype.hasOwnProperty.call(behaviourGuides, selected) ? behaviourGuides[selected] : undefined;
  const sources = Object.prototype.hasOwnProperty.call(behaviourGuideSources, selected) ? behaviourGuideSources[selected] : [];
  const hasGuide = Boolean(guide && plan.split('\n').includes(guide.split('\n')[0]));

  return (
    <section aria-labelledby={`${id}-title`} className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 id={`${id}-title`} className="mb-3 text-sm font-semibold text-brand-950">Behaviour challenges</h3>
      <div className="min-w-0 space-y-3">
        <label htmlFor={`${id}-select`} className="block text-sm font-medium">Choose a challenge</label>
        <select id={`${id}-select`} value={selected} onChange={(event) => { setSelected(event.target.value); setNotice(''); }} className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base">
          <option value="">Select a behaviour challenge</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
          <option value={customOption}>Add a new challenge…</option>
        </select>
        {selected === customOption ? <div className="space-y-2"><label htmlFor={`${id}-custom`} className="block text-sm font-medium">New challenge</label><input id={`${id}-custom`} value={custom} onChange={(event) => setCustom(event.target.value)} className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base" /></div> : null}
        {guide ? (
          <details className="rounded-lg border border-brand-200 p-3">
            <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">View starting plan</summary>
            <p className="my-3 text-sm leading-6">Starting point for this dog. Add it to the plan and adapt the steps and schedule.</p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6">{guide}</p>
            <p className="my-3 text-sm leading-6">Sources: {sources.map((source, index) => <span key={source.url}>{index ? ', ' : ''}<a className="underline" href={source.url}>{source.title}</a></span>)}</p>

          </details>
        ) : challenge ? <p className="text-sm leading-6">Add your own steps in the prescribed plan below. Custom challenges can use your own training steps.</p> : null}
        <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start">
          {guide ? <button type="button" disabled={hasGuide} onClick={() => { onChange(appendPlanText(seedAgreement(plan, challenge, goal), guide)); setNotice('Starting plan added. Edit the prescribed plan below, then save the consultation.'); }} className="min-h-12 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">{hasGuide ? 'Starting plan already added' : 'Add starting plan'}</button> : null}
          <div className="min-w-0"><TrainingExercisePicker plan={plan} onChange={onChange} /></div>
        </div>
        <p role="status" className="text-sm leading-6">{notice}</p>
      </div>
    </section>
  );
}
