"use client";

import { useState } from 'react';
import { activationOptions, formatActivationOption } from '@/lib/activation-options';
import { stimulusOptions, formatStimulusOption } from '@/lib/stimulus-options';
import TrainingExercisePicker from '@/components/TrainingExercisePicker';

export default function ConsultationItem({
  consultation,
  endpointBase = '/api/consultations',
  hiddenFields = [],
  labels = {},
  dogBreedTopLine = false,
  deleteRedirectHref = '/consultations',
}: {
  consultation: any;
  endpointBase?: string;
  hiddenFields?: string[];
  labels?: Record<string, string>;
  dogBreedTopLine?: boolean;
  deleteRedirectHref?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ ...consultation });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const activationValues = activationOptions.map(formatActivationOption);
  const hasCustomActivation = data.activation && !activationValues.includes(data.activation);
  const stimulusValues = stimulusOptions.map(formatStimulusOption);
  const stimulusParts = String(data.stimulusAnalysis || '').split('\n');
  const selectedStimulus = stimulusParts[0] || '';
  const stimulusNotes = stimulusParts.slice(1).join('\n');
  const hasCustomStimulus = selectedStimulus && !stimulusValues.includes(selectedStimulus);
  const hideFocus = hiddenFields.includes('focus');
  const hideOutcome = hiddenFields.includes('outcome');
  const hideActivation = hiddenFields.includes('activation');
  const hideStimulusAnalysis = hiddenFields.includes('stimulusAnalysis');
  const hideNutrition = hiddenFields.includes('nutrition');
  const hideHealth = hiddenFields.includes('health');
  const hideHormoneAnalysis = hiddenFields.includes('hormoneAnalysis');
  const hideLearningHistory = hiddenFields.includes('learningHistory');

  function handleStimulusChange(selected: string, notes = stimulusNotes) {
    handleChange('stimulusAnalysis', [selected, notes].filter(Boolean).join('\n'));
  }

  function handleChange(field: string, value: any) {
    setData((d: any) => ({ ...d, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`${endpointBase}/${consultation.id}`, {
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

  async function deleteRecord() {
    const confirmed = window.confirm('Delete this entry? This cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`${endpointBase}/${consultation.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      window.location.href = deleteRedirectHref;
    } catch (err) {
      alert('Delete error');
      setDeleting(false);
    }
  }

  return (
    <article className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 text-brand-600">
        <p>{data.date}</p>
        <p>{data.client}</p>
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-brand-950">{data.dogName}</h3>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
        <aside className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <label htmlFor={`training-plan-${consultation.id}`} className="block text-sm font-semibold text-brand-950">Prescribed Training Plan</label>
          {editing ? (
            <div className="mt-3 space-y-3">
              <TrainingExercisePicker plan={String(data.prescribedPlan || '')} onChange={(plan) => handleChange('prescribedPlan', plan)} />
              <textarea id={`training-plan-${consultation.id}`} className="min-h-96 w-full rounded border border-brand-200 p-2" value={data.prescribedPlan || ''} onChange={(e) => handleChange('prescribedPlan', e.target.value)} />
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-brand-700">{data.prescribedPlan || 'No training plan prescribed yet.'}</p>
          )}
        </aside>

        <section className="space-y-4 rounded-2xl border border-brand-200 bg-white p-5">
          {!hideFocus ? (
            <div>
              <label className="block text-sm font-medium">Focus</label>
              {editing ? (
                <input className="w-full rounded border p-2" value={data.focus || ''} onChange={(e) => handleChange('focus', e.target.value)} />
              ) : (
                <p className="text-brand-700">{data.focus}</p>
              )}
            </div>
          ) : null}

          {!hideOutcome ? (
            <div>
              <label className="block text-sm font-medium">Recommended outcome</label>
              {editing ? (
                <textarea className="w-full rounded border p-2" value={data.outcome || ''} onChange={(e) => handleChange('outcome', e.target.value)} />
              ) : (
                <p className="text-brand-600">{data.outcome}</p>
              )}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium">{labels.generalDescription || 'General description of the problem'}</label>
            {editing ? (
              <textarea className="w-full rounded border p-2" value={data.generalDescription || ''} onChange={(e) => handleChange('generalDescription', e.target.value)} />
            ) : (
              <p>{data.generalDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {!dogBreedTopLine ? (
              <div>
                <label className="block text-sm font-medium">Dog Breed</label>
                {editing ? (
                  <input className="w-full rounded border p-2" value={data.dogBreed || ''} onChange={(e) => handleChange('dogBreed', e.target.value)} />
                ) : (
                  <p>{data.dogBreed}</p>
                )}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium">{labels.situation || 'Situation'}</label>
              {editing ? (
                <textarea className="w-full rounded border p-2" value={data.situation || ''} onChange={(e) => handleChange('situation', e.target.value)} />
              ) : (
                <p className="text-sm text-brand-600">{data.situation}</p>
              )}
            </div>
          </div>

          {dogBreedTopLine ? (
            <div>
              <label className="block text-sm font-medium">Dog Breed</label>
              {editing ? (
                <input className="w-full rounded border p-2" value={data.dogBreed || ''} onChange={(e) => handleChange('dogBreed', e.target.value)} />
              ) : (
                <p>{data.dogBreed}</p>
              )}
            </div>
          ) : null}

          {!hideLearningHistory ? (
            <div>
              <label className="block text-sm font-medium">Learning History</label>
              {editing ? (
                <textarea className="w-full rounded border p-2" value={data.learningHistory || ''} onChange={(e) => handleChange('learningHistory', e.target.value)} />
              ) : (
                <p>{data.learningHistory}</p>
              )}
            </div>
          ) : null}

          {!hideNutrition || !hideHealth || !hideHormoneAnalysis ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {!hideNutrition ? (
                <div>
                  <label className="block text-sm font-medium">Nutrition</label>
                  {editing ? (
                    <textarea className="w-full rounded border p-2" value={data.nutrition || ''} onChange={(e) => handleChange('nutrition', e.target.value)} />
                  ) : (
                    <p>{data.nutrition}</p>
                  )}
                </div>
              ) : null}

              {!hideHealth ? (
                <div>
                  <label className="block text-sm font-medium">Health</label>
                  {editing ? (
                    <textarea className="w-full rounded border p-2" value={data.health || ''} onChange={(e) => handleChange('health', e.target.value)} />
                  ) : (
                    <p>{data.health}</p>
                  )}
                </div>
              ) : null}

              {!hideHormoneAnalysis ? (
                <div>
                  <label className="block text-sm font-medium">Hormone Analysis</label>
                  {editing ? (
                    <textarea className="w-full rounded border p-2" value={data.hormoneAnalysis || ''} onChange={(e) => handleChange('hormoneAnalysis', e.target.value)} />
                  ) : (
                    <p>{data.hormoneAnalysis}</p>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          {!hideActivation ? (
            <div>
              <label className="block text-sm font-medium">Activation</label>
              {editing ? (
                <select className="w-full rounded border p-2" value={data.activation || ''} onChange={(e) => handleChange('activation', e.target.value)}>
                  <option value="">Select activation</option>
                  {hasCustomActivation ? <option value={data.activation}>{data.activation}</option> : null}
                  {activationOptions.map((option) => {
                    const value = formatActivationOption(option);
                    return (
                      <option key={option.label} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <p>{data.activation}</p>
              )}
            </div>
          ) : null}

          {!hideStimulusAnalysis ? (
            <div>
              <label className="block text-sm font-medium">Stimulus Analysis</label>
              {editing ? (
                <div className="space-y-2">
                  <select className="w-full rounded border p-2" value={selectedStimulus} onChange={(e) => handleStimulusChange(e.target.value)}>
                    <option value="">Select stimulus area</option>
                    {hasCustomStimulus ? <option value={selectedStimulus}>{selectedStimulus}</option> : null}
                    {stimulusOptions.map((option) => {
                      const value = formatStimulusOption(option);
                      return (
                        <option key={option.label} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <textarea className="w-full rounded border p-2" value={stimulusNotes} onChange={(e) => handleStimulusChange(selectedStimulus, e.target.value)} />
                </div>
              ) : (
                <p className="whitespace-pre-line">{data.stimulusAnalysis}</p>
              )}
            </div>
          ) : null}
        </section>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => { if (editing) setData({ ...consultation }); setEditing((current) => !current); }} className="rounded border px-3 py-1">{editing ? 'Cancel' : 'Edit'}</button>
        {editing && (
          <>
            <button type="button" onClick={save} disabled={saving} className="rounded bg-brand-700 px-3 py-1 text-white">{saving ? 'Saving...' : 'Save'}</button>
          </>
        )}
        <button
          type="button"
          onClick={deleteRecord}
          disabled={deleting}
          className="rounded border border-red-200 bg-white px-3 py-1 text-red-700 disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
