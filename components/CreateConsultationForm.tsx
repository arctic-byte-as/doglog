"use client";

import { useEffect, useId, useState } from 'react';
import ActivationPlanOptions from '@/components/ActivationPlanOptions';
import { stimulusOptions, formatStimulusOption } from '@/lib/stimulus-options';
import ConsultationSection from '@/components/ConsultationSection';
import InitialAssessment from '@/components/InitialAssessment';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';
import TrainingExercisePicker from '@/components/TrainingExercisePicker';

type DogOption = {
  id: string;
  name: string;
  breed: string;
  owner: string;
};

export default function CreateConsultationForm({
  initialDogs = [],
  endpoint = '/api/consultations',
  serviceKey,
  hiddenFields = [],
  labels = {},
  dogBreedTopLine = false,
  submitLabel = 'Create Consultation',
  submittingLabel = 'Creating...',
}: {
  initialDogs?: DogOption[];
  endpoint?: string;
  serviceKey?: string;
  hiddenFields?: string[];
  labels?: Record<string, string>;
  dogBreedTopLine?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}) {
  const detailsId = useId();
  const [dogs, setDogs] = useState<DogOption[]>(initialDogs);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    dogId: '',
    dogName: '',
    client: '',
    date: new Date().toISOString().slice(0, 10),
    focus: '',
    outcome: '',
    generalDescription: '',
    dogBreed: '',
    learningHistory: '',
    situation: '',
    nutrition: '',
    health: '',
    hormoneAnalysis: '',
    activation: '',
    stimulusAnalysis: '',
    prescribedPlan: '',
  });
  const stimulusParts = String(form.stimulusAnalysis || '').split('\n');
  const selectedStimulus = stimulusParts[0] || '';
  const stimulusNotes = stimulusParts.slice(1).join('\n');
  const hideOutcome = hiddenFields.includes('outcome');
  const hideActivation = hiddenFields.includes('activation');
  const hideStimulusAnalysis = hiddenFields.includes('stimulusAnalysis');
  const hideNutrition = hiddenFields.includes('nutrition');
  const hideHealth = hiddenFields.includes('health');
  const hideHormoneAnalysis = hiddenFields.includes('hormoneAnalysis');
  const hideLearningHistory = hiddenFields.includes('learningHistory');

  function updateStimulus(selected: string, notes = stimulusNotes) {
    setForm({ ...form, stimulusAnalysis: [selected, notes].filter(Boolean).join('\n') });
  }

  useEffect(() => {
    if (initialDogs.length) {
      if (initialDogs.length === 1) {
        setForm((f: any) => ({
          ...f,
          dogId: initialDogs[0].id,
          dogName: initialDogs[0].name,
          client: initialDogs[0].owner,
          dogBreed: initialDogs[0].breed || '',
        }));
      }
      return;
    }

    // load dogs for selection; fallback to empty
    fetch('/api/dogs')
      .then((r) => r.json())
      .then((data) => {
        const ds = data?.dogs || [];
        setDogs(ds);
        // Auto-select only when there is exactly one dog for this trainer
        if (ds.length === 1) {
          setForm((f: any) => ({
            ...f,
            dogId: ds[0].id,
            dogName: ds[0].name,
            client: ds[0].owner || '',
            dogBreed: ds[0].breed || '',
          }));
        }
      })
      .catch(() => {});
  }, [initialDogs]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, serviceKey }),
      });
      if (!res.ok) throw new Error('Create failed');
      window.location.reload();
    } catch (err) {
      alert('Create error');
    } finally {
      setLoading(false);
    }
  }

  function field(key: string, title: string, multiline = false, card = false) {
    return (
      <ConsultationSection title={title} editing card={card}>
        {(id) => multiline ? (
          <textarea id={id} rows={4} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" />
        ) : (
          <input id={id} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" />
        )}
      </ConsultationSection>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 min-w-0 space-y-4">
      <ConsultationDisclosure title="Training plan">
        <div className={`grid min-w-0 grid-cols-1 items-start gap-4 ${hideOutcome ? '' : 'xl:grid-cols-2'}`}>
          {!hideOutcome ? field('outcome', 'Recommended actions', true, true) : null}
          <ConsultationSection title="Prescribed Training Plan" editing card>
            {(id) => (
              <div className="space-y-3">
                <ActivationPlanOptions plan={form.prescribedPlan || ''} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
                <TrainingExercisePicker plan={form.prescribedPlan || ''} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
                <textarea id={id} rows={8} value={form.prescribedPlan} onChange={(e) => setForm({ ...form, prescribedPlan: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" />
              </div>
            )}
          </ConsultationSection>
        </div>
      </ConsultationDisclosure>
      {!hideHealth || !hideNutrition || !hideHormoneAnalysis || !hideActivation || !hideStimulusAnalysis ? (
        <InitialAssessment>
          {!hideHealth ? field('health', 'Health', false, true) : null}
          {!hideNutrition ? field('nutrition', 'Food', false, true) : null}
          {!hideHormoneAnalysis ? field('hormoneAnalysis', 'Hormones', false, true) : null}
          {!hideActivation ? (
            <ConsultationSection title="Activation" editing card>
              {(id) => (
                <div className="space-y-3">
                  <p id={`${id}-help`} className="text-sm leading-6">Record the current activity routine, including frequency, duration and how the dog responds.</p>
                  <textarea id={id} aria-describedby={`${id}-help`} rows={4} value={form.activation} onChange={(e) => setForm({ ...form, activation: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" />
                </div>
              )}
            </ConsultationSection>
          ) : null}
          {!hideStimulusAnalysis ? (
            <ConsultationSection title="Stimulation analysis" editing card>
              {(id) => (
                <div className="space-y-3">
                  <select id={id} value={selectedStimulus} onChange={(e) => updateStimulus(e.target.value)} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base">
                    <option value="">Select stimulus area</option>
                    {stimulusOptions.map((option) => {
                      const value = formatStimulusOption(option);
                      return <option key={option.label} value={value}>{value}</option>;
                    })}
                  </select>
                  <label htmlFor={`${id}-notes`} className="block text-sm font-medium">Stimulus notes</label>
                  <textarea id={`${id}-notes`} rows={4} value={stimulusNotes} onChange={(e) => updateStimulus(selectedStimulus, e.target.value)} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base resize-y" />
                </div>
              )}
            </ConsultationSection>
          ) : null}
        </InitialAssessment>
      ) : null}
      <ConsultationDisclosure title="Background">
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <section aria-labelledby={detailsId} className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 id={detailsId} className="mb-3 text-sm font-semibold text-brand-950">Consultation details</h3>
          <div className="grid min-w-0 gap-4">
            <label className="block min-w-0">
              <div className="text-xs font-medium">Dog</div>
              {dogs.length === 1 ? (
                <div className="w-full rounded border p-2 bg-gray-50">
                  <div className="text-sm">{dogs[0].name}{dogs[0].breed ? ` — ${dogs[0].breed}` : ''}</div>
                  <input type="hidden" name="dogId" value={form.dogId} />
                </div>
              ) : (
                <select
                  value={form.dogId}
                  onChange={(e) => {
                    const selectedDog = dogs.find((d) => d.id === e.target.value);
                    setForm({
                      ...form,
                      dogId: e.target.value,
                      dogName: selectedDog?.name || '',
                      client: selectedDog?.owner || form.client,
                      dogBreed: selectedDog?.breed || '',
                    });
                  }}
                  className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base"
                >
                  <option value="">Select a dog</option>
                  {dogs.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            </label>

            <label className="block min-w-0">
              <div className="text-xs font-medium">Client</div>
              <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" />
            </label>

            <label className="block min-w-0">
              <div className="text-xs font-medium">Date</div>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" />
            </label>
            {dogBreedTopLine ? (
              <label className="block min-w-0">
                <div className="text-xs font-medium">Dog Breed</div>
                <input value={form.dogBreed} onChange={(e) => setForm({ ...form, dogBreed: e.target.value })} className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-brand-200 bg-white p-3 text-base" />
              </label>
            ) : null}
          </div>
          </section>
          {field('generalDescription', labels.generalDescription || 'Description of the situation', true, true)}
          {!dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          {!hideLearningHistory ? field('learningHistory', 'Learning History', false, true) : null}
        </div>
      </ConsultationDisclosure>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="min-h-11 w-full rounded-lg bg-brand-700 px-4 py-3 text-white sm:w-auto">{loading ? submittingLabel : submitLabel}</button>
      </div>
    </form>
  );
}
