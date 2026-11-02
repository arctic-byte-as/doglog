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

import { groupTrainingPlan } from '@/lib/training-agreement';
import { consultationCustomerKey, consultationCustomerOptions, type ConsultationDogOption as DogOption } from '@/lib/consultation-customers';

const emptyDogs: DogOption[] = [];

export default function CreateConsultationForm({
  initialDogs = emptyDogs,
  endpoint = '/api/consultations',
  serviceKey,
  hiddenFields = [],
  labels = {},
  dogBreedTopLine = false,
  submitLabel = 'Save draft',
  submittingLabel = 'Saving...',
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
  const [customerSelection, setCustomerSelection] = useState('');
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

  const selectedDog = dogs.find((dog) => dog.id === form.dogId);
  const customerKey = customerSelection || (selectedDog ? consultationCustomerKey(selectedDog) : '');
  const customerOptions = consultationCustomerOptions(dogs);
  const customerDogs = dogs.filter((dog) => consultationCustomerKey(dog) === customerKey);

  function selectDog(dogId: string) {
    const switchingDog = Boolean(form.dogId && form.dogId !== dogId);
    const groups = groupTrainingPlan(form.prescribedPlan || '');
    const noteFields = ['focus', 'outcome', 'generalDescription', 'learningHistory', 'situation', 'nutrition', 'health', 'hormoneAnalysis', 'activation', 'stimulusAnalysis'];
    const hasNotes = noteFields.some((key) => String(form[key] || '').trim()) || groups.problem || groups.goal || groups.training.length || groups.activities.length;
    if (switchingDog && hasNotes && !window.confirm('Changing the customer or dog will clear the consultation notes and training plan you have entered. Continue?')) return false;
    breedGuidanceByBreed.current = {};
    const nextDog = dogs.find((dog) => dog.id === dogId);
    const currentGuidance = readBreedGuidance(form.prescribedPlan || '');
    if (form.dogId && currentGuidance) breedGuidanceByDog.current[form.dogId] = currentGuidance;
    const nextGuidance = Object.prototype.hasOwnProperty.call(breedGuidanceByDog.current, dogId)
      ? breedGuidanceByDog.current[dogId]
      : defaultBreedGuidance(nextDog?.breed || '');
    setForm((current: any) => ({ ...current,
      ...(switchingDog ? Object.fromEntries(noteFields.map((key) => [key, ''])) : {}),
      prescribedPlan: writeBreedGuidance(switchingDog ? '' : (current.prescribedPlan || ''), nextGuidance),
      dogId, dogName: nextDog?.name || '', client: nextDog?.owner || '', dogBreed: nextDog?.breed || '',
    }));
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDog || !customerKey) { alert('Select a customer and dog before saving.'); return; }
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prescribedPlan: ensureBreedGuidance(form.prescribedPlan || '', form.dogBreed || ''), serviceKey }),
      });
      if (!res.ok) { const result = await res.json(); throw new Error(result.error || 'Create failed'); }
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Create error');
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
      <section aria-labelledby={detailsId} className="min-w-0 space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id={detailsId} className="text-lg font-semibold text-brand-950">Who is this consultation for?</h2>
          <button type="submit" disabled={loading || !form.dogId} className="min-h-11 rounded-lg bg-brand-700 px-4 py-3 text-white disabled:opacity-60">{loading ? submittingLabel : submitLabel}</button>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          <label className="block min-w-0 text-sm font-medium">Customer
            <select required value={customerKey} disabled={loading} onChange={(event) => {
              const key = event.target.value;
              const matchingDogs = dogs.filter((dog) => consultationCustomerKey(dog) === key);
              if (selectDog(matchingDogs.length === 1 ? matchingDogs[0].id : '')) setCustomerSelection(key);
            }} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base">
              <option value="">Select a customer</option>
              {customerOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm font-medium">Dog
            <select required value={form.dogId} disabled={loading || !customerKey} onChange={(event) => selectDog(event.target.value)} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base">
              <option value="">Select a dog</option>
              {customerDogs.map((dog) => <option key={dog.id} value={dog.id}>{dog.name}{dog.breed ? ` — ${dog.breed}` : ''}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm font-medium">Consultation date
            <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white p-3 text-base" />
          </label>
        </div>
        <p className="text-sm text-brand-700">Choose the customer, then their dog. You will be asked before changing a dog with entered consultation notes.</p>
        {!dogs.length ? <p className="text-sm text-brand-700">Add a dog and its owner before creating a consultation.</p> : null}
        {selectedDog ? <p className="break-words text-sm text-brand-700">Customer: {selectedDog.customer?.name || selectedDog.owner} · Dog: {selectedDog.name}</p> : null}
      </section>
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
          {dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          {field('generalDescription', labels.generalDescription || 'Description of the situation', true, true)}
          {!dogBreedTopLine ? field('dogBreed', 'Dog Breed', false, true) : null}
          <DogDevelopmentEditor profileAge={dogs.find((dog) => dog.id === form.dogId)?.age} plan={String(form.prescribedPlan || '')} onChange={(plan) => setForm({ ...form, prescribedPlan: plan })} />
          {!hideLearningHistory ? field('learningHistory', 'Learning History', false, true) : null}
        </div>
      </ConsultationDisclosure>
      <div className="flex justify-end">
        <button type="submit" disabled={loading || !form.dogId} className="min-h-11 w-full rounded-lg bg-brand-700 px-4 py-3 text-white sm:w-auto">{loading ? submittingLabel : submitLabel}</button>
      </div>
    </form>
  );
}
