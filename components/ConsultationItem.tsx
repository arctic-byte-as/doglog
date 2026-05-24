"use client";

import { useState } from 'react';

export default function ConsultationItem({ consultation }: { consultation: any }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(consultation);

  async function save() {
    try {
      const res = await fetch(`/api/consultations/${consultation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditing(false);
      window.location.reload();
    } catch (err) {
      alert('Save error');
    }
  }

  return (
    <article className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 text-brand-600">
        <p>{data.date}</p>
        <p>{data.client}</p>
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-brand-950">{data.dogName}</h3>

      <div className="mt-4 space-y-3">
        <p className="text-brand-700">Focus: {data.focus}</p>
        <p className="text-brand-600">Recommended outcome: {data.outcome}</p>

        <h4 className="mt-4 font-semibold">General description of the problem</h4>
        <p>{data.generalDescription}</p>

        <h4 className="mt-4 font-semibold">Dog Breed</h4>
        <p>{data.dogBreed}</p>

        <h4 className="mt-4 font-semibold">Learning History and Situation</h4>
        <p>{data.learningHistory}</p>
        <p className="text-sm text-brand-600">Situation: {data.situation}</p>

        <h4 className="mt-4 font-semibold">Nutrition</h4>
        <p>{data.nutrition}</p>

        <h4 className="mt-4 font-semibold">Health</h4>
        <p>{data.health}</p>

        <h4 className="mt-4 font-semibold">Hormone Analysis</h4>
        <p>{data.hormoneAnalysis}</p>

        <h4 className="mt-4 font-semibold">Activation</h4>
        <p>{data.activation}</p>

        <h4 className="mt-4 font-semibold">Stimulus Analysis</h4>
        <p>{data.stimulusAnalysis}</p>

        <h4 className="mt-4 font-semibold">Prescribed Training Plan</h4>
        <p>{data.prescribedPlan}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setEditing(!editing)} className="rounded border px-3 py-1">{editing ? 'Cancel' : 'Edit'}</button>
        {editing && (
          <div className="space-y-2 w-full">
            <textarea className="w-full rounded border p-2" value={data.prescribedPlan || ''} onChange={(e) => setData({ ...data, prescribedPlan: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={save} className="rounded bg-brand-700 px-3 py-1 text-white">Save</button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
