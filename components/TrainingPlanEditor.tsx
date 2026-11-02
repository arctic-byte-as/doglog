'use client';

import { useId, useState } from 'react';
import { splitTrainingPlan } from '@/lib/training-plan-blocks';
import { isAgreementBlock as isAgreement } from '@/lib/training-agreement';
import TrainingPlanContent from '@/components/TrainingPlanContent';

const isAgreementBlock = (block: string) => isAgreement(block) || block.startsWith('Dog age and development:\n') || block.startsWith('Breed guidance:\n');

type RemovedSection = { text: string; index: number };

export default function TrainingPlanEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [removed, setRemoved] = useState<RemovedSection | null>(null);
  const blocks = splitTrainingPlan(value);
  const sectionNumber = (index: number) => blocks.slice(0, index + 1).filter((block) => !isAgreementBlock(block)).length;
  const join = (sections: string[]) => sections.join('\n\n---\n\n');

  function edit(index: number) {
    const current = currentBlocks();
    const nextIndex = splitTrainingPlan(join(current.slice(0, index))).length;
    onChange(join(current));
    setDraft(current[index]);
    setEditing(nextIndex);
  }

  function commit(text: string, index: number) {
    const next = [...blocks];
    next[index] = text;
    onChange(join(next.filter((section) => section.trim())));
  }

  function currentBlocks() {
    return blocks.map((block, index) => editing === index ? draft : block);
  }

  function remove(index: number) {
    const current = currentBlocks();
    setRemoved({ text: current[index], index });
    onChange(join(current.filter((_, position) => position !== index)));
    setEditing(null);
  }

  function undo() {
    if (!removed) return;
    const next = currentBlocks();
    next.splice(Math.min(removed.index, next.length), 0, removed.text);
    onChange(join(next));
    setRemoved(null);
    setEditing(null);
  }

  return <div data-plan-editor className="min-w-0 space-y-4">
    <p className="text-sm leading-6 text-brand-700">Edit or remove each section below. Choose Done editing, then save the consultation to keep your changes.</p>
    {blocks.map((block, index) => isAgreementBlock(block) ? null : <section key={index} className="min-w-0 space-y-3 rounded-lg border border-brand-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">Section {sectionNumber(index)}</p>
        <div className="flex flex-wrap gap-2">
          {editing === index ? <button type="button" onPointerDown={(event) => event.preventDefault()} onClick={() => { commit(draft, index); setEditing(null); }} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium">Done editing</button> : <button type="button" onPointerDown={(event) => event.preventDefault()} aria-label={`Edit section ${sectionNumber(index)}`} onClick={() => edit(index)} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium">Edit</button>}
          <button type="button" onPointerDown={(event) => event.preventDefault()} aria-label={`Remove section ${sectionNumber(index)}`} onClick={() => remove(index)} className="min-h-11 rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-red-700">Remove</button>
        </div>
      </div>
      {editing === index ? <div className="space-y-2"><label htmlFor={`${id}-${index}`} className="block text-sm font-medium">Section details</label><textarea autoFocus id={`${id}-${index}`} rows={12} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={(event) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.closest('[data-plan-editor]')?.contains(event.relatedTarget)) return;
        commit(draft, index);
        setEditing(null);
      }} className="min-h-11 w-full min-w-0 resize-y rounded-lg border border-brand-200 bg-white p-3 text-base" /></div> : <TrainingPlanContent value={block} />}
    </section>)}
    {!blocks.some((block) => !isAgreementBlock(block)) ? <p className="text-sm text-brand-700">No sections yet. Add an activity, starting plan or your own section.</p> : null}
    {removed ? <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg bg-brand-50 p-3"><span className="text-sm">Section removed from the draft.</span><button type="button" onPointerDown={(event) => event.preventDefault()} onClick={undo} className="min-h-11 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-medium">Undo removal</button></div> : null}
    <button type="button" onPointerDown={(event) => event.preventDefault()} onClick={() => { const next = [...splitTrainingPlan(join(currentBlocks())), 'New training plan section']; onChange(join(next)); setDraft('New training plan section'); setEditing(next.length - 1); }} className="min-h-11 rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium">Add my own section</button>
  </div>;
}
