"use client";

import { useState } from 'react';
import ActivationPlanOptions from '@/components/ActivationPlanOptions';
import { stimulusOptions, formatStimulusOption } from '@/lib/stimulus-options';
import ConsultationSection from '@/components/ConsultationSection';
import InitialAssessment from '@/components/InitialAssessment';
import { SectionCard } from '@/components/SectionCard';
import ConsultationPdfDownload from '@/components/ConsultationPdfDownload';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';
import TrainingExercisePicker from '@/components/TrainingExercisePicker';

export default function ConsultationItem({
  consultation,
  title,
  endpointBase = '/api/consultations',
  hiddenFields = [],
  labels = {},
  dogBreedTopLine = false,
  deleteRedirectHref = '/consultations',
}: {
  consultation: any;
  title?: string;
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
  const stimulusValues = stimulusOptions.map(formatStimulusOption);
  const stimulusParts = String(data.stimulusAnalysis || '').split('\n');
  const selectedStimulus = stimulusParts[0] || '';
  const stimulusNotes = stimulusParts.slice(1).join('\n');
  const hasCustomStimulus = selectedStimulus && !stimulusValues.includes(selectedStimulus);
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

  function field(key: string, title: string, multiline = true, card = false) {
    return (
      <ConsultationSection title={title} editing={editing} card={card}>
        {(id) => editing ? (multiline ? (
          <textarea id={id} rows={4} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" value={data[key] || ''} onChange={(e) => handleChange(key, e.target.value)} />
        ) : (
          <input id={id} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" value={data[key] || ''} onChange={(e) => handleChange(key, e.target.value)} />
        )) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-brand-700">{data[key] || 'Not recorded'}</p>
        )}
      </ConsultationSection>
    );
  }

  const content = (
    <article className="min-w-0 space-y-4">
      <ConsultationDisclosure title="Training plan">
        <div className={`grid min-w-0 grid-cols-1 items-start gap-4 ${hideOutcome ? '' : 'xl:grid-cols-2'}`}>
          {!hideOutcome ? field('outcome', 'Recommended actions', true, true) : null}
          <ConsultationSection title="Prescribed Training Plan" editing={editing} card>
            {(id) => editing ? (
              <div className="space-y-3">
                <ActivationPlanOptions plan={String(data.prescribedPlan || '')} onChange={(plan) => handleChange('prescribedPlan', plan)} />
                <TrainingExercisePicker plan={String(data.prescribedPlan || '')} onChange={(plan) => handleChange('prescribedPlan', plan)} />
                <textarea id={id} rows={8} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" value={data.prescribedPlan || ''} onChange={(e) => handleChange('prescribedPlan', e.target.value)} />
              </div>
            ) : <p className="whitespace-pre-wrap break-words text-sm leading-6 text-brand-700">{data.prescribedPlan || 'No training plan prescribed yet.'}</p>}
          </ConsultationSection>
        </div>
      </ConsultationDisclosure>
      {!hideHealth || !hideNutrition || !hideHormoneAnalysis || !hideActivation || !hideStimulusAnalysis ? (
        <InitialAssessment>
          {!hideHealth ? field('health', 'Health', true, true) : null}
          {!hideNutrition ? field('nutrition', 'Food', true, true) : null}
          {!hideHormoneAnalysis ? field('hormoneAnalysis', 'Hormones', true, true) : null}
          {!hideActivation ? (
            <ConsultationSection title="Activation" editing={editing} card>
              {(id) => (
                <div className="space-y-3">
                  {editing ? <p id={`${id}-help`} className="text-sm leading-6">Record the current activity routine, including frequency, duration and how the dog responds.</p> : null}
                  {editing ? <textarea id={id} aria-describedby={`${id}-help`} rows={4} value={data.activation || ''} onChange={(e) => handleChange('activation', e.target.value)} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" /> : <p className="whitespace-pre-wrap break-words text-sm leading-6">{data.activation || 'Not recorded'}</p>}
                </div>
              )}
            </ConsultationSection>
          ) : null}
          {!hideStimulusAnalysis ? (
            <ConsultationSection title="Stimulation analysis" editing={editing} card>
              {(id) => editing ? (
                <div className="space-y-3">
                  <select id={id} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" value={selectedStimulus} onChange={(e) => handleStimulusChange(e.target.value)}>
                    <option value="">Select stimulus area</option>
                    {hasCustomStimulus ? <option value={selectedStimulus}>{selectedStimulus}</option> : null}
                    {stimulusOptions.map((option) => {
                      const value = formatStimulusOption(option);
                      return <option key={option.label} value={value}>{value}</option>;
                    })}
                  </select>
                  <label htmlFor={`${id}-notes`} className="block text-sm font-medium">Stimulus notes</label>
                  <textarea id={`${id}-notes`} rows={4} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" value={stimulusNotes} onChange={(e) => handleStimulusChange(selectedStimulus, e.target.value)} />
                </div>
              ) : <p className="whitespace-pre-wrap break-words text-sm leading-6">{data.stimulusAnalysis || 'Not recorded'}</p>}
            </ConsultationSection>
          ) : null}
        </InitialAssessment>
      ) : null}
      <ConsultationDisclosure title="Background">
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <header className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 break-words text-sm text-brand-600">
              <p>{data.date}</p>
              <p className="min-w-0">{data.client}</p>
            </div>
            <h3 className="mt-3 break-words text-2xl font-semibold text-brand-950">{data.dogName}</h3>
          </header>
          {dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          {field('generalDescription', labels.generalDescription || 'Description of the situation', true, true)}
          {!dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          {!hideLearningHistory ? field('learningHistory', 'Learning History', true, true) : null}
        </div>
      </ConsultationDisclosure>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => { if (editing) setData({ ...consultation }); setEditing((current) => !current); }} className="min-h-11 rounded-lg border px-4 py-2">{editing ? 'Cancel' : 'Edit'}</button>
        {editing ? <button type="button" onClick={save} disabled={saving} className="min-h-11 rounded-lg bg-brand-700 px-4 py-2 text-white">{saving ? 'Saving...' : 'Save'}</button> : null}
        <button type="button" onClick={deleteRecord} disabled={deleting} className="min-h-11 rounded-lg border border-red-200 bg-white px-4 py-2 text-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
      </div>
    </article>
  );

  return title ? (
    <SectionCard title={title} actions={endpointBase === '/api/consultations' ? <ConsultationPdfDownload consultationId={consultation.id} disabled={editing} compact /> : undefined}>
      {content}
    </SectionCard>
  ) : content;
}
