"use client";

import { useEffect, useId, useRef, useState } from 'react';
import BreedGuidanceEditor from '@/components/BreedGuidanceEditor';
import { changeGuidanceBreed, ensureBreedGuidance, defaultBreedGuidance, readBreedGuidance, writeBreedGuidance, type BreedGuidance } from '@/lib/breed-guidance';
import DogDevelopmentEditor from '@/components/DogDevelopmentEditor';
import MixedBreedSelect from '@/components/MixedBreedSelect';
import TrainingAgreementEditor from '@/components/TrainingAgreementEditor';
import BehaviourChallengePicker from '@/components/BehaviourChallengePicker';
import TrainingPlanEditor from '@/components/TrainingPlanEditor';
import ActivationSummary from '@/components/ActivationSummary';
import { stimulusOptions, formatStimulusOption } from '@/lib/stimulus-options';
import ConsultationSection from '@/components/ConsultationSection';
import InitialAssessment from '@/components/InitialAssessment';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';

type DogOption = {
  id: string;
  name: string;
  breed: string;
  age?: string;
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
  const breedGuidanceByBreed = useRef<Record<string, BreedGuidance>>({});
  const breedGuidanceByDog = useRef<Record<string, BreedGuidance>>({});
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
        body: JSON.stringify({ ...form, prescribedPlan: ensureBreedGuidance(form.prescribedPlan || '', form.dogBreed || ''), serviceKey }),
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
        {(id) => key === 'dogBreed' ? (
          <MixedBreedSelect id={id} value={form.dogBreed || ''} onChange={(value) => setForm((current: any) => ({ ...current, dogBreed: value, prescribedPlan: changeGuidanceBreed(current.prescribedPlan || '', value, breedGuidanceByBreed.current) }))} />
        ) : multiline ? (
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
        <TrainingAgreementEditor plan={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
        <BreedGuidanceEditor key={`${form.dogId}-${form.dogBreed}`} breed={form.dogBreed || ''} plan={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
        <BehaviourChallengePicker plan={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
        <div className={`grid min-w-0 grid-cols-1 items-start gap-4 ${hideOutcome ? '' : 'xl:grid-cols-2'}`}>
          {!hideOutcome ? field('outcome', 'Recommended actions', true, true) : null}
          <ConsultationSection title="Prescribed Training Plan" card>
            {(id) => (
              <div className="space-y-3">
                <TrainingPlanEditor value={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
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
            <ConsultationSection title="Activation" card>
              {(id) => (
                <ActivationSummary value={form.activation || ''} onChange={(value) => setForm({ ...form, activation: value })} />
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
                    breedGuidanceByBreed.current = {};
                    const selectedDog = dogs.find((d) => d.id === e.target.value);
                    const currentGuidance = readBreedGuidance(form.prescribedPlan || '');
                    if (form.dogId && currentGuidance) breedGuidanceByDog.current[form.dogId] = currentGuidance;
                    const nextGuidance = Object.prototype.hasOwnProperty.call(breedGuidanceByDog.current, e.target.value)
                      ? breedGuidanceByDog.current[e.target.value]
                      : defaultBreedGuidance(selectedDog?.breed || '');
                    setForm({
                      ...form,
                      prescribedPlan: writeBreedGuidance(form.prescribedPlan || '', nextGuidance),
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
            {dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          </div>
          </section>
          {field('generalDescription', labels.generalDescription || 'Description of the situation', true, true)}
          {!dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          <DogDevelopmentEditor profileAge={dogs.find((dog) => dog.id === form.dogId)?.age} plan={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
          {!hideLearningHistory ? field('learningHistory', 'Learning History', false, true) : null}
        </div>
      </ConsultationDisclosure>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="min-h-11 w-full rounded-lg bg-brand-700 px-4 py-3 text-white sm:w-auto">{loading ? submittingLabel : submitLabel}</button>
      </div>
    </form>
  );
}
