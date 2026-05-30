"use client";

import { useEffect, useState } from 'react';
import { activationOptions, formatActivationOption } from '@/lib/activation-options';
import { stimulusOptions, formatStimulusOption } from '@/lib/stimulus-options';
import { categories } from '@/components/TrainingLibraryClient';

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
  const [dogs, setDogs] = useState<DogOption[]>(initialDogs);
  const [loading, setLoading] = useState(false);
  const [trainingCategory, setTrainingCategory] = useState(categories[0].title);
  const selectedTrainingCategory = categories.find((category) => category.title === trainingCategory) || categories[0];
  const [trainingExercise, setTrainingExercise] = useState(selectedTrainingCategory.exercises[0].title);
  const selectedTrainingExercise = selectedTrainingCategory.exercises.find((exercise) => exercise.title === trainingExercise) || selectedTrainingCategory.exercises[0];
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
  const hideFocus = hiddenFields.includes('focus');
  const hideOutcome = hiddenFields.includes('outcome');
  const hideActivation = hiddenFields.includes('activation');
  const hideStimulusAnalysis = hiddenFields.includes('stimulusAnalysis');
  const hideNutrition = hiddenFields.includes('nutrition');
  const hideHealth = hiddenFields.includes('health');
  const hideHormoneAnalysis = hiddenFields.includes('hormoneAnalysis');
  const hideLearningHistory = hiddenFields.includes('learningHistory');

  function formatTrainingPlan() {
    return [
      `${selectedTrainingCategory.title}: ${selectedTrainingExercise.title}`,
      '',
      `Goal: ${selectedTrainingExercise.goal}`,
      '',
      'Setup:',
      ...selectedTrainingExercise.setup.map((item) => `- ${item}`),
      '',
      'Steps:',
      ...selectedTrainingExercise.steps.map((step, index) => `${index + 1}. ${step}`),
      '',
      `Progress marker: ${selectedTrainingExercise.progress}`,
      '',
      `Avoid: ${selectedTrainingExercise.avoid}`,
    ].join('\n');
  }

  function handleTrainingCategoryChange(value: string) {
    const nextCategory = categories.find((category) => category.title === value) || categories[0];
    setTrainingCategory(nextCategory.title);
    setTrainingExercise(nextCategory.exercises[0].title);
  }

  function appendTrainingPlan() {
    const currentPlan = String(form.prescribedPlan || '').trim();
    const nextPlan = formatTrainingPlan();
    setForm({ ...form, prescribedPlan: currentPlan ? `${currentPlan}\n\n---\n\n${nextPlan}` : nextPlan });
  }

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

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg border border-brand-200 bg-white p-4">
      <div className={`grid gap-2 ${dogBreedTopLine ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <label className="block">
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
              className="w-full rounded border p-2"
            >
              <option value="">Select a dog</option>
              {dogs.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}
        </label>

        <label className="block">
          <div className="text-xs font-medium">Client</div>
          <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full rounded border p-2" />
        </label>

        <label className="block">
          <div className="text-xs font-medium">Date</div>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded border p-2" />
        </label>
        {dogBreedTopLine ? (
          <label className="block">
            <div className="text-xs font-medium">Dog Breed</div>
            <input value={form.dogBreed} onChange={(e) => setForm({ ...form, dogBreed: e.target.value })} className="w-full rounded border p-2" />
          </label>
        ) : null}
      </div>

      {!hideFocus ? (
        <div>
          <label className="block text-sm font-medium">Focus</label>
          <input value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} className="w-full rounded border p-2" />
        </div>
      ) : null}

      {!hideOutcome ? (
        <div>
          <label className="block text-sm font-medium">Recommended outcome</label>
          <textarea value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full rounded border p-2" />
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium">{labels.generalDescription || 'General description of the problem'}</label>
        <textarea value={form.generalDescription} onChange={(e) => setForm({ ...form, generalDescription: e.target.value })} className="w-full rounded border p-2" />
      </div>

      {!dogBreedTopLine || !hideLearningHistory ? (
        <div className="grid gap-2 md:grid-cols-2">
          {!dogBreedTopLine ? (
            <label className="block">
              <div className="text-xs font-medium">Dog Breed</div>
              <input value={form.dogBreed} onChange={(e) => setForm({ ...form, dogBreed: e.target.value })} className="w-full rounded border p-2" />
            </label>
          ) : null}
          {!hideLearningHistory ? (
            <label className="block">
              <div className="text-xs font-medium">Learning History</div>
              <input value={form.learningHistory} onChange={(e) => setForm({ ...form, learningHistory: e.target.value })} className="w-full rounded border p-2" />
            </label>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium">{labels.situation || 'Situation'}</label>
        <textarea value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })} className="w-full rounded border p-2" />
      </div>

      {!hideNutrition || !hideHealth || !hideHormoneAnalysis ? (
        <div className="grid gap-2 md:grid-cols-3">
          {!hideNutrition ? (
            <label className="block">
              <div className="text-xs font-medium">Nutrition</div>
              <input value={form.nutrition} onChange={(e) => setForm({ ...form, nutrition: e.target.value })} className="w-full rounded border p-2" />
            </label>
          ) : null}
          {!hideHealth ? (
            <label className="block">
              <div className="text-xs font-medium">Health</div>
              <input value={form.health} onChange={(e) => setForm({ ...form, health: e.target.value })} className="w-full rounded border p-2" />
            </label>
          ) : null}
          {!hideHormoneAnalysis ? (
            <label className="block">
              <div className="text-xs font-medium">Hormone Analysis</div>
              <input value={form.hormoneAnalysis} onChange={(e) => setForm({ ...form, hormoneAnalysis: e.target.value })} className="w-full rounded border p-2" />
            </label>
          ) : null}
        </div>
      ) : null}

      {!hideActivation || !hideStimulusAnalysis ? (
        <div className="grid gap-2 md:grid-cols-2">
          {!hideActivation ? (
            <label className="block">
              <div className="text-xs font-medium">Activation</div>
              <select value={form.activation} onChange={(e) => setForm({ ...form, activation: e.target.value })} className="w-full rounded border p-2">
                <option value="">Select activation</option>
                {activationOptions.map((option) => {
                  const value = formatActivationOption(option);
                  return (
                    <option key={option.label} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
          ) : null}
          {!hideStimulusAnalysis ? (
            <label className="block">
              <div className="text-xs font-medium">Stimulus Analysis</div>
              <select value={selectedStimulus} onChange={(e) => updateStimulus(e.target.value)} className="w-full rounded border p-2">
                <option value="">Select stimulus area</option>
                {stimulusOptions.map((option) => {
                  const value = formatStimulusOption(option);
                  return (
                    <option key={option.label} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      {!hideStimulusAnalysis ? (
        <div>
          <label className="block text-sm font-medium">Stimulus notes</label>
          <textarea
            value={stimulusNotes}
            onChange={(e) => updateStimulus(selectedStimulus, e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium">Prescribed Training Plan</label>
        <div className="mb-3 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <select value={trainingCategory} onChange={(e) => handleTrainingCategoryChange(e.target.value)} className="w-full rounded border p-2">
            {categories.map((category) => (
              <option key={category.title} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
          <select value={trainingExercise} onChange={(e) => setTrainingExercise(e.target.value)} className="w-full rounded border p-2">
            {selectedTrainingCategory.exercises.map((exercise) => (
              <option key={exercise.title} value={exercise.title}>
                {exercise.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={appendTrainingPlan} className="rounded border border-brand-200 px-4 py-2 text-brand-800">
            Add plan
          </button>
        </div>
        <textarea value={form.prescribedPlan} onChange={(e) => setForm({ ...form, prescribedPlan: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded bg-brand-700 px-4 py-2 text-white">{loading ? submittingLabel : submitLabel}</button>
      </div>
    </form>
  );
}
