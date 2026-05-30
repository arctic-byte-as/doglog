"use client";

import { useEffect, useMemo, useState } from 'react';

type Exercise = {
  title: string;
  goal: string;
  setup: string[];
  steps: string[];
  progress: string;
  avoid: string;
};

type Category = {
  title: string;
  summary: string;
  exercises: Exercise[];
};

export const categories: Category[] = [
  {
    title: 'Foundation Skills',
    summary: 'Core reward-based behaviours that make later training easier.',
    exercises: [
      {
        title: 'Marker and Reward Timing',
        goal: 'Teach the dog that a marker predicts a reward and identifies the behaviour that earned it.',
        setup: ['Small food rewards', 'Quiet space', 'Marker word or clicker'],
        steps: ['Say the marker once.', 'Deliver food within one second.', 'Repeat 10 times.', 'Use the marker when the dog offers an easy behaviour such as looking at you.'],
        progress: 'The dog turns toward you happily after hearing the marker.',
        avoid: 'Do not repeat the marker several times or delay the reward until the dog loses the connection.',
      },
      {
        title: 'Name Response',
        goal: 'Build fast orientation to the handler without nagging.',
        setup: ['Low-distraction room', 'High-value rewards'],
        steps: ['Say the dog’s name once.', 'Mark when the dog looks toward you.', 'Reward close to your leg.', 'Gradually practise in more distracting places.'],
        progress: 'The dog turns toward the handler on one cue in several environments.',
        avoid: 'Do not use the name before unpleasant events or repeat it when the dog is over threshold.',
      },
      {
        title: 'Settle on Mat',
        goal: 'Create a predictable calm place for visitors, meals, and household activity.',
        setup: ['Mat or bed', 'Small rewards', 'Quiet room'],
        steps: ['Reward any interest in the mat.', 'Reward paws on the mat.', 'Reward lying down.', 'Add duration one second at a time.', 'Add mild household distractions.'],
        progress: 'The dog chooses the mat and can stay relaxed while normal activity happens nearby.',
        avoid: 'Do not force the dog onto the mat or use it as punishment.',
      },
    ],
  },
  {
    title: 'Loose Lead and Recall',
    summary: 'Common outdoor skills: walking with connection and coming back reliably.',
    exercises: [
      {
        title: 'Reward Zone Walking',
        goal: 'Teach the dog that staying near the handler pays well.',
        setup: ['Harness', 'Lead', 'Food rewards', 'Low-distraction route'],
        steps: ['Start moving.', 'Mark when the dog is beside you or checks in.', 'Reward by your leg.', 'Change direction before the lead tightens.', 'Gradually add distance and distractions.'],
        progress: 'The dog checks in frequently and the lead stays loose for longer stretches.',
        avoid: 'Do not jerk the lead or keep walking while the dog is pulling toward something valuable.',
      },
      {
        title: 'Emergency U-Turn',
        goal: 'Give the handler a cheerful way to move away from triggers.',
        setup: ['Quiet path', 'High-value food', 'Happy verbal cue'],
        steps: ['Say the cue and turn away.', 'Feed several rewards while moving with the dog.', 'Practise until the turn is fluent.', 'Use before the dog reacts to a trigger.'],
        progress: 'The dog turns with the handler quickly and happily.',
        avoid: 'Do not wait until the dog is already lunging or barking before cueing the turn.',
      },
      {
        title: 'Recall Party',
        goal: 'Make coming back more rewarding than continuing away.',
        setup: ['Long line', 'Safe open area', 'Excellent rewards'],
        steps: ['Wait for the dog to glance toward you.', 'Cue recall once.', 'Move backward and encourage.', 'Mark arrival.', 'Reward generously and release the dog back to sniffing.'],
        progress: 'The dog returns quickly and does not see recall as the end of fun.',
        avoid: 'Do not call repeatedly or call only when something unpleasant is about to happen.',
      },
    ],
  },
  {
    title: 'Reactivity and Aggression',
    summary: 'Threshold-based work for dogs who bark, lunge, freeze, growl, or snap.',
    exercises: [
      {
        title: 'Look at That',
        goal: 'Change the dog’s emotional response to a trigger while keeping them under threshold.',
        setup: ['Enough distance from trigger', 'High-value rewards', 'Escape route'],
        steps: ['Let the dog notice the trigger.', 'Mark the moment they look without escalating.', 'Feed away from the trigger.', 'Repeat at a comfortable distance.', 'Decrease distance only when recovery is easy.'],
        progress: 'The dog can notice the trigger and reorient to the handler calmly.',
        avoid: 'Do not move closer because the handler wants progress; let the dog’s body language decide.',
      },
      {
        title: 'Treat Retreat',
        goal: 'Help worried dogs create distance from people while receiving reinforcement.',
        setup: ['Helper person', 'Treats tossed away from helper', 'Open space'],
        steps: ['Helper stays side-on and quiet.', 'Toss food behind the dog.', 'Let the dog move away to eat.', 'Repeat without asking for approach.', 'Stop before the dog shows stress.'],
        progress: 'The dog can observe the person and recover without pressure.',
        avoid: 'Do not lure the dog toward a person they are worried about.',
      },
      {
        title: 'Management Plan',
        goal: 'Reduce rehearsals of aggressive or reactive behaviour while training develops.',
        setup: ['Trigger list', 'Distance plan', 'Visual barriers or route changes'],
        steps: ['List predictable triggers.', 'Choose prevention strategies.', 'Use barriers, distance, quiet routes, or room separation.', 'Track reactions and recovery time.', 'Review weekly.'],
        progress: 'The dog has fewer reactions and recovers faster after surprises.',
        avoid: 'Do not rely on training alone while the dog continues practising reactions daily.',
      },
    ],
  },
  {
    title: 'Barking and Home Manners',
    summary: 'Reduce excessive barking and build calmer choices around everyday triggers.',
    exercises: [
      {
        title: 'Quiet Scatter',
        goal: 'Interrupt barking kindly and reinforce disengagement.',
        setup: ['Small food rewards', 'Known low-level sound trigger'],
        steps: ['Play or wait for a mild trigger.', 'When the dog pauses or turns, mark.', 'Scatter food on the floor.', 'Repeat at easier levels.', 'Pair with management such as window film if needed.'],
        progress: 'The dog can disengage from sounds or movement more quickly.',
        avoid: 'Do not shout over barking; added noise can increase arousal.',
      },
      {
        title: 'Doorbell Pattern',
        goal: 'Teach a predictable routine when the doorbell or knocking happens.',
        setup: ['Doorbell recording', 'Mat', 'Rewards'],
        steps: ['Play the sound very quietly.', 'Scatter food or cue mat.', 'Gradually raise volume.', 'Practise with a helper outside.', 'Reward calm recovery after each repetition.'],
        progress: 'The dog hears the cue and moves into the trained routine.',
        avoid: 'Do not start with real visitors if the dog cannot handle the recording.',
      },
      {
        title: 'Four Paws Greeting',
        goal: 'Replace jumping with an incompatible calm greeting behaviour.',
        setup: ['Helper visitor', 'Lead or barrier', 'Rewards'],
        steps: ['Approach only while four paws are down.', 'Mark and reward calm standing or sitting.', 'Pause or step back if jumping starts.', 'Repeat with short greetings.', 'Add different helpers.'],
        progress: 'The dog keeps paws down to make people approach.',
        avoid: 'Do not reward jumping with touch, eye contact, or excited talking.',
      },
    ],
  },
  {
    title: 'Separation Support',
    summary: 'Gradual confidence-building for dogs who struggle when left alone.',
    exercises: [
      {
        title: 'Departure Cue Desensitisation',
        goal: 'Make keys, shoes, and bags less predictive of being left alone.',
        setup: ['List of departure cues', 'Quiet home', 'Rewards or normal activity'],
        steps: ['Pick one low-level cue.', 'Do it without leaving.', 'Return to normal activity.', 'Repeat until the dog stays relaxed.', 'Combine cues only when each one is easy.'],
        progress: 'The dog notices departure cues without following, pacing, or vocalising.',
        avoid: 'Do not stack all cues and leave before the dog is ready.',
      },
      {
        title: 'Micro Absences',
        goal: 'Build comfort with tiny absences before extending time.',
        setup: ['Camera if available', 'Safe rest area', 'Timer'],
        steps: ['Step out for one second.', 'Return before distress appears.', 'Repeat several easy reps.', 'Increase by tiny amounts.', 'End sessions while the dog is successful.'],
        progress: 'The dog remains settled during predictable short absences.',
        avoid: 'Do not push duration until the dog panics; recovery matters more than minutes.',
      },
      {
        title: 'Independence Station',
        goal: 'Teach relaxed separation inside the home before alone-time work.',
        setup: ['Bed or mat', 'Chew or food toy', 'Baby gate if useful'],
        steps: ['Settle the dog near you.', 'Give a calm enrichment item.', 'Move one step away and return.', 'Build distance within the room.', 'Practise behind a barrier for short periods.'],
        progress: 'The dog can rest while the owner moves around nearby.',
        avoid: 'Do not use confinement if it increases panic or frustration.',
      },
    ],
  },
  {
    title: 'Puppy and Adolescent Skills',
    summary: 'Common developmental issues: mouthing, impulse control, handling, and confidence.',
    exercises: [
      {
        title: 'Mouthing Redirect',
        goal: 'Teach puppies what to bite and how to pause during play.',
        setup: ['Soft toys', 'Food rewards', 'Short play sessions'],
        steps: ['Offer a toy before hands become exciting.', 'Mark and reward toy contact.', 'Pause play briefly if teeth touch skin.', 'Restart calmly.', 'Provide naps and chewing outlets.'],
        progress: 'The puppy chooses toys faster and recovers from excitement sooner.',
        avoid: 'Do not punish growling, mouthing, or normal puppy exploration.',
      },
      {
        title: 'Cooperative Handling',
        goal: 'Help the dog opt in to grooming, vet checks, and paw handling.',
        setup: ['Treats', 'Brush or nail clippers', 'Non-slip surface'],
        steps: ['Present the tool at a distance.', 'Reward calm looking.', 'Touch briefly and reward.', 'Let the dog move away.', 'Build duration only when the dog re-engages willingly.'],
        progress: 'The dog stays relaxed and returns voluntarily after pauses.',
        avoid: 'Do not restrain the dog through fear unless urgent welfare care requires professional help.',
      },
      {
        title: 'Impulse Control Games',
        goal: 'Teach waiting and release cues without intimidation.',
        setup: ['Food in hand', 'Toy or bowl', 'Release cue'],
        steps: ['Hold food in a closed hand.', 'Mark when the dog backs off or waits.', 'Open hand and release to eat.', 'Practise with toys and bowls.', 'Keep sessions short.'],
        progress: 'The dog pauses and looks for the release cue.',
        avoid: 'Do not tease the dog or create frustration by making criteria too hard.',
      },
    ],
  },
];

const libraryStorageKey = 'norsepaw-training-library';

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

export default function TrainingLibraryClient({ editable = false }: { editable?: boolean }) {
  const [libraryCategories, setLibraryCategories] = useState<Category[]>(categories);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(categories[0].title);
  const [selectedExerciseTitle, setSelectedExerciseTitle] = useState(categories[0].exercises[0].title);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);

  useEffect(() => {
    const saved = window.localStorage.getItem(libraryStorageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Category[];
      if (Array.isArray(parsed) && parsed.length) {
        setLibraryCategories(parsed);
        setSelectedCategoryTitle(parsed[0].title);
        setSelectedExerciseTitle(parsed[0].exercises[0]?.title || '');
      }
    } catch {
      window.localStorage.removeItem(libraryStorageKey);
    }
  }, []);

  function saveLibrary(nextCategories: Category[]) {
    setLibraryCategories(nextCategories);
    window.localStorage.setItem(libraryStorageKey, JSON.stringify(nextCategories));
  }

  const selectedCategory = useMemo(
    () => libraryCategories.find((category) => category.title === selectedCategoryTitle) || libraryCategories[0],
    [libraryCategories, selectedCategoryTitle],
  );
  const selectedExercise = useMemo(
    () => selectedCategory?.exercises.find((exercise) => exercise.title === selectedExerciseTitle) || selectedCategory?.exercises[0],
    [selectedCategory, selectedExerciseTitle],
  );

  function chooseCategory(category: Category) {
    setSelectedCategoryTitle(category.title);
    setSelectedExerciseTitle(category.exercises[0]?.title || '');
  }

  function addCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!categoryForm.title.trim()) return;

    const nextCategory: Category = {
      title: categoryForm.title.trim(),
      summary: categoryForm.summary.trim() || 'Custom training category.',
      exercises: [],
    };
    const nextCategories = [...libraryCategories, nextCategory];
    saveLibrary(nextCategories);
    setCategoryForm(emptyCategory);
    chooseCategory(nextCategory);
  }

  function addExercise(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedCategory || !exerciseForm.title.trim()) return;

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
    saveLibrary(nextCategories);
    setExerciseForm(emptyExercise);
    setSelectedExerciseTitle(nextExercise.title);
  }

  function resetLibrary() {
    saveLibrary(categories);
    setSelectedCategoryTitle(categories[0].title);
    setSelectedExerciseTitle(categories[0].exercises[0].title);
  }

  if (!selectedCategory) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-4 lg:overflow-visible lg:pb-0">
        {libraryCategories.map((category) => (
          <button
            key={category.title}
            type="button"
            onClick={() => chooseCategory(category)}
            className={`block min-w-64 rounded-2xl border bg-white p-4 text-left text-brand-950 shadow-sm transition hover:border-brand-300 lg:w-full lg:min-w-0 ${
              selectedCategory.title === category.title ? 'border-brand-700' : 'border-brand-200'
            }`}
          >
            <span className="block font-semibold">{category.title}</span>
            <span className="mt-2 block text-sm leading-5 text-brand-700">{category.summary}</span>
          </button>
        ))}

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
            <button type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white">
              Add category
            </button>
          </form>
        ) : null}
      </aside>

      <main className="space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-brand-950">Sub category</span>
            <select
              value={selectedExercise?.title || ''}
              onChange={(event) => setSelectedExerciseTitle(event.target.value)}
              className="mt-3 w-full rounded-lg border border-brand-200 px-3 py-2 text-brand-900"
            >
              {selectedCategory.exercises.map((exercise) => (
                <option key={exercise.title} value={exercise.title}>
                  {exercise.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedExercise ? (
          <article className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-brand-700">{selectedCategory.title}</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-950">{selectedExercise.title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-700">{selectedExercise.goal}</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Setup</h3>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-brand-700">
                  {selectedExercise.setup.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Progress marker</h3>
                <p className="mt-2 text-sm leading-6 text-brand-700">{selectedExercise.progress}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-brand-950">Training details</h3>
              <ol className="mt-2 space-y-2 text-sm leading-6 text-brand-700">
                {selectedExercise.steps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <h3 className="text-sm font-semibold text-brand-950">Avoid</h3>
              <p className="mt-2 text-sm leading-6 text-brand-700">{selectedExercise.avoid}</p>
            </div>
          </article>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">Add a sub category to start building this category.</p>
        )}

        {editable ? (
          <form onSubmit={addExercise} className="space-y-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-brand-950">Add sub category and details</h3>
              <button type="button" onClick={resetLibrary} className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800">
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
            <button type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white">
              Add sub category
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}

export type { Category, Exercise };
