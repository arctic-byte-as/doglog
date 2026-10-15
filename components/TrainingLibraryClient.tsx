"use client";

import { useMemo, useState } from 'react';

import { categories, type Category, type Exercise } from '@/lib/training-library';
import { useTrainingLibrary } from '@/lib/use-training-library';

export { categories } from '@/lib/training-library';
type TrainingLibraryLocale = 'en' | 'nb';

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const emptyCategory = {
  title: '',
  summary: '',
};

const emptyExercise = {
  title: '',
  goal: '',
  setup: '',
  steps: '',
  progress: '',
  avoid: '',
};

const defaultTrainingLibraryLabels = {
  category: 'Category',
  subcategory: 'Sub category',
  setup: 'Setup',
  progressMarker: 'Progress marker',
  trainingDetails: 'Training details',
  avoid: 'Avoid',
  addSubcategoryPrompt: 'Add a sub category to start building this category.',
};

function translatedCategory(category: Category, locale: TrainingLibraryLocale) {
  if (locale !== 'nb') return category;

  const translation = category.translations?.nb;
  return {
    ...category,
    title: translation?.title || category.title,
    summary: translation?.summary || category.summary,
  };
}

function translatedExercise(exercise: Exercise | undefined, locale: TrainingLibraryLocale) {
  if (!exercise || locale !== 'nb') return exercise;

  const translation = exercise.translations?.nb;
  return {
    ...exercise,
    title: translation?.title || exercise.title,
    goal: translation?.goal || exercise.goal,
    setup: translation?.setup || exercise.setup,
    steps: translation?.steps || exercise.steps,
    progress: translation?.progress || exercise.progress,
    avoid: translation?.avoid || exercise.avoid,
  };
}

export default function TrainingLibraryClient({
  editable = false,
  labels = defaultTrainingLibraryLabels,
  locale = 'en',
}: {
  editable?: boolean;
  labels?: typeof defaultTrainingLibraryLabels;
  locale?: TrainingLibraryLocale;
}) {
  const { libraryCategories, loading, saving, error, legacyAvailable, importLegacy, saveLibrary } = useTrainingLibrary();
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(categories[0].title);
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState(categories[0].exercises[0].title);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);

  const selectedCategory = useMemo(
    () => libraryCategories.find((category) => category.title === selectedCategoryTitle) || libraryCategories[0],
    [libraryCategories, selectedCategoryTitle],
  );
  const selectedExercise = useMemo(
    () => selectedCategory?.exercises.find((exercise) => exercise.title === selectedExerciseTitle) || selectedCategory?.exercises[0],
    [selectedCategory, selectedExerciseTitle],
  );
  const displayedCategory = translatedCategory(selectedCategory, locale);
  const displayedExercise = translatedExercise(selectedExercise, locale);

  function chooseCategory(category: Category) {
    setSelectedCategoryTitle(category.title);
    setSelectedExerciseTitle(category.exercises[0]?.title || '');
  }

  function chooseCategoryByTitle(title: string) {
    const category = libraryCategories.find((item) => item.title === title);
    if (category) chooseCategory(category);
  }

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    if (loading || saving || !categoryForm.title.trim()) return;

    const nextCategory: Category = {
      title: categoryForm.title.trim(),
      summary: categoryForm.summary.trim() || 'Custom training category.',
      exercises: [],
    };
    const nextCategories = [...libraryCategories, nextCategory];
    if (!(await saveLibrary(nextCategories))) return;
    setCategoryForm(emptyCategory);
    chooseCategory(nextCategory);
  }

  async function addExercise(event: React.FormEvent) {
    event.preventDefault();
    if (loading || saving || !selectedCategory || !exerciseForm.title.trim()) return;

    const nextExercise: Exercise = {
      title: exerciseForm.title.trim(),
      goal: exerciseForm.goal.trim(),
      setup: splitLines(exerciseForm.setup),
      steps: splitLines(exerciseForm.steps),
      progress: exerciseForm.progress.trim(),
      avoid: exerciseForm.avoid.trim(),
    };
    const nextCategories = libraryCategories.map((category) =>
      category.title === selectedCategory.title
        ? { ...category, exercises: [...category.exercises, nextExercise] }
        : category,
    );
    if (!(await saveLibrary(nextCategories))) return;
    setExerciseForm(emptyExercise);
    setSelectedExerciseTitle(nextExercise.title);
  }

  async function resetLibrary() {
    if (!window.confirm("Reset the shared training library to its defaults?")) return;
    if (!(await saveLibrary(categories))) return;
    setSelectedCategoryTitle(categories[0].title);
    setSelectedExerciseTitle(categories[0].exercises[0].title);
  }

  if (!selectedCategory) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="lg:col-span-2" role="status">
        {loading ? <p>Loading training library…</p> : null}
        {saving ? <p>Saving training library…</p> : null}
        {error ? <p className="text-red-700">{error}</p> : null}
        {editable && legacyAvailable && !loading ? <div className="rounded-xl border border-brand-200 bg-brand-50 p-4"><p>This browser has a saved library. Import its exercises to make them available on your other devices. Existing shared exercises will be kept.</p><button type="button" disabled={saving} onClick={importLegacy} className="mt-2 rounded-lg bg-brand-700 px-4 py-2 text-white">Import browser exercises</button></div> : null}
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">{labels.category}</span>
            <select
              value={selectedCategory.title}
              onChange={(event) => chooseCategoryByTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
            >
              {libraryCategories.map((category) => (
                <option key={category.title} value={category.title}>
                  {translatedCategory(category, locale).title}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-sm leading-6 text-brand-700">{displayedCategory.summary}</p>
        </div>

        {editable ? (
          <form onSubmit={addCategory} className="min-w-72 space-y-3 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm lg:min-w-0">
            <h3 className="font-semibold text-brand-950">Add category</h3>
            <input
              required
              placeholder="Category name"
              value={categoryForm.title}
              onChange={(event) => setCategoryForm({ ...categoryForm, title: event.target.value })}
              className="w-full rounded-lg border border-brand-200 px-3 py-2"
            />
            <textarea
              placeholder="Category summary"
              value={categoryForm.summary}
              onChange={(event) => setCategoryForm({ ...categoryForm, summary: event.target.value })}
              className="min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
            <button disabled={loading || saving} type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white">
              Add category
            </button>
          </form>
        ) : null}
      </aside>

      <main className="space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-brand-950">{labels.subcategory}</span>
            <select
              value={selectedExercise?.title || ''}
              onChange={(event) => setSelectedExerciseTitle(event.target.value)}
              className="mt-3 w-full rounded-lg border border-brand-200 px-3 py-2 text-brand-900"
            >
              {selectedCategory.exercises.map((exercise) => (
                <option key={exercise.title} value={exercise.title}>
                  {translatedExercise(exercise, locale)?.title || exercise.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedExercise ? (
          <article className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-brand-700">{displayedCategory.title}</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-950">{displayedExercise?.title || selectedExercise.title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-700">{displayedExercise?.goal || selectedExercise.goal}</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">{labels.setup}</h3>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-brand-700">
                  {(displayedExercise?.setup || selectedExercise.setup).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-950">{labels.progressMarker}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-700">{displayedExercise?.progress || selectedExercise.progress}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-brand-950">{labels.trainingDetails}</h3>
              <ol className="mt-2 space-y-2 text-sm leading-6 text-brand-700">
                {(displayedExercise?.steps || selectedExercise.steps).map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <h3 className="text-sm font-semibold text-brand-950">{labels.avoid}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-700">{displayedExercise?.avoid || selectedExercise.avoid}</p>
            </div>
          </article>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{labels.addSubcategoryPrompt}</p>
        )}

        {editable ? (
          <form onSubmit={addExercise} className="space-y-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-brand-950">Add sub category and details</h3>
              <button disabled={loading || saving} type="button" onClick={resetLibrary} className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800">
                Reset library
              </button>
            </div>
            <input
              required
              placeholder="Sub category name"
              value={exerciseForm.title}
              onChange={(event) => setExerciseForm({ ...exerciseForm, title: event.target.value })}
              className="w-full rounded-lg border border-brand-200 px-3 py-2"
            />
            <textarea
              placeholder="Goal"
              value={exerciseForm.goal}
              onChange={(event) => setExerciseForm({ ...exerciseForm, goal: event.target.value })}
              className="min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <textarea
                placeholder="Setup, one item per line"
                value={exerciseForm.setup}
                onChange={(event) => setExerciseForm({ ...exerciseForm, setup: event.target.value })}
                className="min-h-28 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
              <textarea
                placeholder="Training details, one step per line"
                value={exerciseForm.steps}
                onChange={(event) => setExerciseForm({ ...exerciseForm, steps: event.target.value })}
                className="min-h-28 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <textarea
                placeholder="Progress marker"
                value={exerciseForm.progress}
                onChange={(event) => setExerciseForm({ ...exerciseForm, progress: event.target.value })}
                className="min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
              <textarea
                placeholder="Avoid"
                value={exerciseForm.avoid}
                onChange={(event) => setExerciseForm({ ...exerciseForm, avoid: event.target.value })}
                className="min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </div>
            <button disabled={loading || saving} type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white">
              Add sub category
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}

export type { Category, Exercise };
