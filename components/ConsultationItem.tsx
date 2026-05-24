"use client";

import { useState } from 'react';

export default function ConsultationItem({ consultation }: { consultation: any }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ ...consultation });
  const [saving, setSaving] = useState(false);

  function handleChange(field: string, value: any) {
    setData((d: any) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/consultations/${consultation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focus: data.focus,
          outcome: data.outcome,
          generalDescription: data.generalDescription,
          dogBreed: data.dogBreed,
          learningHistory: data.learningHistory,
          situation: data.situation,
          nutrition: data.nutrition,
          health: data.health,
          hormoneAnalysis: data.hormoneAnalysis,
          activation: data.activation,
          stimulusAnalysis: data.stimulusAnalysis,
          prescribedPlan: data.prescribedPlan,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditing(false);
      window.location.reload();
    } catch (err) {
      alert('Save error');
    } finally {
      setSaving(false);
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
        <div>
          <label className="block text-sm font-medium">Focus</label>
          {editing ? (
            <input className="w-full rounded border p-2" value={data.focus || ''} onChange={(e) => handleChange('focus', e.target.value)} />
          ) : (
            <p className="text-brand-700">{data.focus}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Recommended outcome</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.outcome || ''} onChange={(e) => handleChange('outcome', e.target.value)} />
          ) : (
            <p className="text-brand-600">{data.outcome}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">General description of the problem</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.generalDescription || ''} onChange={(e) => handleChange('generalDescription', e.target.value)} />
          ) : (
            <p>{data.generalDescription}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Dog Breed</label>
            {editing ? (
              <input className="w-full rounded border p-2" value={data.dogBreed || ''} onChange={(e) => handleChange('dogBreed', e.target.value)} />
            ) : (
              <p>{data.dogBreed}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Situation</label>
            {editing ? (
              <textarea className="w-full rounded border p-2" value={data.situation || ''} onChange={(e) => handleChange('situation', e.target.value)} />
            ) : (
              <p className="text-sm text-brand-600">{data.situation}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Learning History</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.learningHistory || ''} onChange={(e) => handleChange('learningHistory', e.target.value)} />
          ) : (
            <p>{data.learningHistory}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Nutrition</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.nutrition || ''} onChange={(e) => handleChange('nutrition', e.target.value)} />
          ) : (
            <p>{data.nutrition}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Health</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.health || ''} onChange={(e) => handleChange('health', e.target.value)} />
          ) : (
            <p>{data.health}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Hormone Analysis</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.hormoneAnalysis || ''} onChange={(e) => handleChange('hormoneAnalysis', e.target.value)} />
          ) : (
            <p>{data.hormoneAnalysis}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Activation</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.activation || ''} onChange={(e) => handleChange('activation', e.target.value)} />
          ) : (
            <p>{data.activation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Stimulus Analysis</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.stimulusAnalysis || ''} onChange={(e) => handleChange('stimulusAnalysis', e.target.value)} />
          ) : (
            <p>{data.stimulusAnalysis}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Prescribed Training Plan</label>
          {editing ? (
            <textarea className="w-full rounded border p-2" value={data.prescribedPlan || ''} onChange={(e) => handleChange('prescribedPlan', e.target.value)} />
          ) : (
            <p>{data.prescribedPlan}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setEditing((s) => !s)} className="rounded border px-3 py-1">{editing ? 'Cancel' : 'Edit'}</button>
        {editing && (
          <>
            <button onClick={save} disabled={saving} className="rounded bg-brand-700 px-3 py-1 text-white">{saving ? 'Saving...' : 'Save'}</button>
          </>
        )}
      </div>
    </article>
  );
}
