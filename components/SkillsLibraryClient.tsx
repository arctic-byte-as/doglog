"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CoreSkill, SkillSubcategory } from '@/lib/skills-library';

const legacyStorageKey = 'norsepaw-skills-library';

const defaultSkills: CoreSkill[] = [
  {
    title: 'Boundaries',
    summary: 'Teach clear, kind limits around rooms, doors, gardens, thresholds, furniture, and people.',
    subcategories: [
      {
        title: 'Room and threshold boundaries',
        goal: 'The dog learns that staying on the correct side of a boundary is rewarding and predictable.',
        steps:
          'Start at an easy boundary such as a doorway. Reward the dog for pausing or choosing to remain behind the line. Add a release cue so the dog understands when crossing is available. Build duration, then add mild movement and household distractions.',
        coachingNotes:
          'Keep the dog successful with distance, barriers, and a lead where needed. Reward the choice you want instead of physically blocking or correcting mistakes.',
        youtubeUrl: '',
      },
      {
        title: 'Outdoor boundary foundations',
        goal: 'Build safe awareness of garden edges, driveways, or training area borders.',
        steps:
          'Work on lead at first. Walk toward the boundary, mark and reward before the dog crosses, then move away together. Add visible markers if helpful. Practise many short repetitions before expecting off-lead reliability.',
        coachingNotes:
          'Outdoor boundaries should be trained as a management-supported skill, not relied on as the only safety system near roads or hazards.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Middle',
    summary: 'A position between the handler legs for connection, confidence, and controlled movement.',
    subcategories: [
      {
        title: 'Find middle',
        goal: 'The dog moves happily into position between the handler legs.',
        steps:
          'Begin with the dog behind you or beside you. Lure or hand-target them into the middle position, mark when their shoulders are between your legs, and reward low in front of them. Fade the lure into a hand signal and then add the verbal cue.',
        coachingNotes:
          'Use a comfortable stance and avoid trapping the dog. This should feel like a safe station, not restraint.',
        youtubeUrl: '',
      },
      {
        title: 'Middle with duration',
        goal: 'The dog can stay in middle while the handler feeds, talks, or scans the environment.',
        steps:
          'Reward one second in position, then release. Add duration in tiny increments. Practise one step forward, one step back, and gentle turns before using the skill near distractions.',
        coachingNotes:
          'Useful for nervous dogs in busy places, but only if the dog has a positive history with the position.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Magic Mat',
    summary: 'A portable settle station that helps the dog relax in homes, classes, cafes, and visits.',
    subcategories: [
      {
        title: 'Mat orientation',
        goal: 'The dog chooses to move onto the mat because the mat predicts calm reinforcement.',
        steps:
          'Place a non-slip mat down. Mark and reward any look, step, or movement toward it. Toss the reward off the mat so the dog can choose to return. Build to all four paws, then a down.',
        coachingNotes:
          'Do not force the dog onto the mat. Keep early sessions short and cheerful.',
        youtubeUrl: '',
      },
      {
        title: 'Settle and release',
        goal: 'The dog relaxes on the mat until released.',
        steps:
          'Reward relaxed postures such as hip shift, chin down, soft eyes, or slower breathing. Add duration slowly. Use a release cue every time the session ends so the dog understands the pattern.',
        coachingNotes:
          'The mat should never be used as punishment. It works best when it predicts safety, clarity, and calm rewards.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Loose Leash Walking',
    summary: 'Teach the dog to move with the handler while the lead stays relaxed.',
    subcategories: [
      {
        title: 'Reward zone',
        goal: 'The dog learns that walking near the handler with slack in the lead pays well.',
        steps:
          'Start in a low-distraction space. Mark check-ins, slack lead moments, and movement beside the handler. Deliver rewards near the handler leg. Change direction before the lead tightens and gradually add real-world distractions.',
        coachingNotes:
          'Short training walks are often more useful than long pulling walks. Meet exercise needs separately while this skill is developing.',
        youtubeUrl: '',
      },
      {
        title: 'Sniff and walk balance',
        goal: 'The dog learns when to move with the handler and when sniffing is available as reinforcement.',
        steps:
          'Use a walking cue for connection and a release cue for sniffing. Reward good leash choices with both food and access to safe sniffing. Practise transitions between the two modes.',
        coachingNotes:
          'Sniffing can be a powerful reward. Avoid turning every walk into constant obedience.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Contact',
    summary: 'Build voluntary eye contact, check-ins, and handler connection without nagging.',
    subcategories: [
      {
        title: 'Offered check-in',
        goal: 'The dog voluntarily looks back to the handler in easy environments.',
        steps:
          'Stand quietly. When the dog glances toward you, mark and reward. Reset by tossing a treat away, then wait for the next offered check-in. Add movement and distractions gradually.',
        coachingNotes:
          'Avoid repeating the dog name. Let the dog discover that checking in is valuable.',
        youtubeUrl: '',
      },
      {
        title: 'Contact around distractions',
        goal: 'The dog can reconnect with the handler after noticing something interesting.',
        steps:
          'Work far enough from the distraction that the dog can think. Mark the moment they reorient, reward generously, and move away if needed. Reduce distance only when recovery is easy.',
        coachingNotes:
          'If the dog cannot eat, turn, or respond, increase distance and lower the difficulty.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Play',
    summary: 'Use play as relationship-building, reinforcement, confidence work, and impulse-control practice.',
    subcategories: [
      {
        title: 'Toy engagement',
        goal: 'The dog learns that interactive play with the handler is fun and safe.',
        steps:
          'Choose a toy the dog likes. Move it away from the dog to invite chase, keep sessions short, and pause before arousal becomes too high. Restart play when the dog re-engages with the toy.',
        coachingNotes:
          'Play is not one-size-fits-all. Some dogs prefer food, chase, tug, sniffing, or social praise.',
        youtubeUrl: '',
      },
      {
        title: 'Tug with rules',
        goal: 'The dog can play tug while keeping teeth on the toy and responding to pauses.',
        steps:
          'Use a toy long enough to keep hands safe. Start gentle tug, then go still and trade for food or another toy. Restart play as the reward for letting go or targeting the toy cleanly.',
        coachingNotes:
          'Tug should feel cooperative. Stop before frustration or over-arousal takes over.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Target Hand',
    summary: 'Teach the dog to touch a hand target for movement, confidence, recall, and positioning.',
    subcategories: [
      {
        title: 'Nose to hand',
        goal: 'The dog touches the handler hand with their nose on cue.',
        steps:
          'Present an open palm close to the dog. Mark the instant the nose moves toward or touches the hand, then reward from the other hand. Repeat until the dog seeks the hand, then add the cue.',
        coachingNotes:
          'Hand targeting should be easy and upbeat. Move the target only a little at first.',
        youtubeUrl: '',
      },
      {
        title: 'Target for movement',
        goal: 'Use the hand target to move the dog without pulling, pushing, or pressure.',
        steps:
          'Ask for a hand target, then place the target slightly to the side, onto a mat, or through a turn. Reward each touch. Build small movement chains before adding distractions.',
        coachingNotes:
          'This is useful for shy dogs, cooperative handling, positioning, and redirecting attention.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'OK',
    summary: 'A clear release cue that tells the dog when a behaviour is finished or access is available.',
    subcategories: [
      {
        title: 'Release from stillness',
        goal: 'The dog learns that OK means they may leave a position or take access.',
        steps:
          'Ask for an easy sit, down, or mat behaviour. Reward the position. Say OK and move or toss a reward away so the dog leaves the position. Repeat until the release cue is clear.',
        coachingNotes:
          'Use one consistent release word. Avoid saying it casually if it is meant to have training meaning.',
        youtubeUrl: '',
      },
      {
        title: 'Permission to access',
        goal: 'The dog waits briefly for access to food, doors, toys, or sniffing.',
        steps:
          'Start with low-value access. Mark calm waiting, then say OK and allow access. Keep criteria easy and build duration slowly.',
        coachingNotes:
          'The release cue should create clarity, not frustration. Do not make the dog wait too long too soon.',
        youtubeUrl: '',
      },
    ],
  },
  {
    title: 'Recall',
    summary: 'Create a highly reinforced cue for returning to the handler in safe training setups.',
    subcategories: [
      {
        title: 'Recall party',
        goal: 'The dog learns that coming back is exciting and worthwhile.',
        steps:
          'Start indoors or in a secure area. Say the recall cue once, move away cheerfully, mark arrival, and reward with food, play, or praise. Release the dog back to safe exploration when possible.',
        coachingNotes:
          'Do not call repeatedly or call only when fun ends. A strong recall needs a long history of excellent outcomes.',
        youtubeUrl: '',
      },
      {
        title: 'Long-line recall',
        goal: 'Practise recall safely outdoors while preventing rehearsal of ignoring the cue.',
        steps:
          'Use a harness and long line in an open safe area. Wait for moments when the dog can succeed. Cue once, encourage movement toward you, reward generously, and reset.',
        coachingNotes:
          'The long line is a safety tool, not a correction tool. Keep it loose and manage distance.',
        youtubeUrl: '',
      },
    ],
  },
];

const emptySubcategory: SkillSubcategory = {
  title: '',
  goal: '',
  steps: '',
  coachingNotes: '',
  youtubeUrl: '',
};

const emptyCoreSkill = {
  title: '',
  summary: '',
};

function isLikelyYoutubeUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname);
  } catch {
    return false;
  }
}

function getYoutubeVideoId(value: string) {
  if (!value.trim()) return null;

  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function SkillsLibraryClient({ editable = true }: { editable?: boolean }) {
  const [skills, setSkills] = useState<CoreSkill[]>(defaultSkills);
  const [selectedSkillTitle, setSelectedSkillTitle] = useState(defaultSkills[0].title);
  const [selectedSubcategoryTitle, setSelectedSubcategoryTitle] = useState(defaultSkills[0].subcategories[0].title);
  const [coreSkillForm, setCoreSkillForm] = useState(emptyCoreSkill);
  const [form, setForm] = useState(emptySubcategory);
  const [coreSkillMessage, setCoreSkillMessage] = useState('');
  const [message, setMessage] = useState('');
  const [sharedLibraryLoaded, setSharedLibraryLoaded] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const saveCounter = useRef(0);

  useEffect(() => {
    let cancelled = false;

    function selectFirst(nextSkills: CoreSkill[]) {
      setSelectedSkillTitle(nextSkills[0].title);
      setSelectedSubcategoryTitle(nextSkills[0].subcategories[0]?.title || '');
    }

    function getLegacySkills() {
      const saved = window.localStorage.getItem(legacyStorageKey);
      if (!saved) return null;

      try {
        const parsed = JSON.parse(saved) as CoreSkill[];
        return Array.isArray(parsed) && parsed.length ? parsed : null;
      } catch {
        window.localStorage.removeItem(legacyStorageKey);
        return null;
      }
    }

    async function loadSharedLibrary() {
      const legacySkills = getLegacySkills();

      try {
        const response = await fetch('/api/skills-library', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load skills library');

        const body = (await response.json()) as { skills?: CoreSkill[] | null };
        if (cancelled) return;

        if (Array.isArray(body.skills) && body.skills.length) {
          setSkills(body.skills);
          selectFirst(body.skills);
          setSharedLibraryLoaded(true);
          return;
        }

        if (editable && legacySkills) {
          setSkills(legacySkills);
          selectFirst(legacySkills);
          setSharedLibraryLoaded(true);
          await saveSkillsToServer(legacySkills, 'Imported your saved skills library for customers.');
          return;
        }
      } catch {
        if (!cancelled && editable && legacySkills) {
          setSkills(legacySkills);
          selectFirst(legacySkills);
          setMessage('Using the saved copy from this browser. Shared save will retry when the server is available.');
        }
      }

      if (!cancelled) setSharedLibraryLoaded(true);
    }

    loadSharedLibrary();

    return () => {
      cancelled = true;
    };
  }, [editable]);

  function saveSkills(nextSkills: CoreSkill[]) {
    setSkills(nextSkills);
    setHasLocalChanges(true);
  }

  async function saveSkillsToServer(nextSkills: CoreSkill[], successMessage = 'Saved for customers.') {
    const saveId = saveCounter.current + 1;
    saveCounter.current = saveId;
    setMessage('Saving shared skills library...');

    try {
      const response = await fetch('/api/skills-library', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: nextSkills }),
      });

      if (!response.ok) throw new Error('Could not save skills library');
      if (saveCounter.current === saveId) {
        setHasLocalChanges(false);
        setMessage(successMessage);
      }
    } catch {
      if (saveCounter.current === saveId) {
        setMessage('Could not save the shared skills library. Please try again.');
      }
    }
  }

  useEffect(() => {
    if (!editable || !sharedLibraryLoaded || !hasLocalChanges) return;

    const timeout = window.setTimeout(() => {
      saveSkillsToServer(skills);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [editable, hasLocalChanges, sharedLibraryLoaded, skills]);

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.title === selectedSkillTitle) || skills[0],
    [skills, selectedSkillTitle],
  );
  const selectedSubcategory = useMemo(
    () =>
      selectedSkill?.subcategories.find((subcategory) => subcategory.title === selectedSubcategoryTitle) ||
      selectedSkill?.subcategories[0],
    [selectedSkill, selectedSubcategoryTitle],
  );
  const youtubeVideoId = selectedSubcategory?.youtubeUrl ? getYoutubeVideoId(selectedSubcategory.youtubeUrl) : null;

  function chooseSkill(skill: CoreSkill) {
    setSelectedSkillTitle(skill.title);
    setSelectedSubcategoryTitle(skill.subcategories[0]?.title || '');
    setCoreSkillMessage('');
    setMessage('');
  }

  function chooseSkillByTitle(title: string) {
    const skill = skills.find((item) => item.title === title);
    if (skill) chooseSkill(skill);
  }

  function chooseSubcategory(title: string) {
    setSelectedSubcategoryTitle(title);
    setMessage('');
  }

  function updateSelectedSubcategory(field: keyof SkillSubcategory, value: string) {
    if (!editable) return;

    setMessage('');

    if (field === 'youtubeUrl' && !isLikelyYoutubeUrl(value)) {
      setMessage('Use a YouTube link such as https://www.youtube.com/watch?v=... or https://youtu.be/...');
    }

    const nextSkills = skills.map((skill) => {
      if (skill.title !== selectedSkill.title) return skill;

      return {
        ...skill,
        subcategories: skill.subcategories.map((subcategory) =>
          subcategory.title === selectedSubcategory?.title ? { ...subcategory, [field]: value } : subcategory,
        ),
      };
    });

    saveSkills(nextSkills);
    if (field === 'title') setSelectedSubcategoryTitle(value);
  }

  function addCoreSkill(event: React.FormEvent) {
    event.preventDefault();
    if (!editable) return;

    const title = coreSkillForm.title.trim();
    const summary = coreSkillForm.summary.trim();
    setCoreSkillMessage('');
    setMessage('');

    if (!title) return;

    const titleAlreadyExists = skills.some((skill) => skill.title.toLowerCase() === title.toLowerCase());
    if (titleAlreadyExists) {
      setCoreSkillMessage('That core subject already exists.');
      return;
    }

    const nextSkill: CoreSkill = {
      title,
      summary: summary || 'Summary to be added.',
      subcategories: [],
    };
    const nextSkills = [...skills, nextSkill];

    saveSkills(nextSkills);
    setSelectedSkillTitle(nextSkill.title);
    setSelectedSubcategoryTitle('');
    setCoreSkillForm(emptyCoreSkill);
    setCoreSkillMessage('Core subject added. Add sub categories when you are ready.');
  }

  function addSubcategory(event: React.FormEvent) {
    event.preventDefault();
    if (!editable) return;

    setMessage('');

    if (!form.title.trim()) return;
    if (!isLikelyYoutubeUrl(form.youtubeUrl)) {
      setMessage('Use a YouTube link such as https://www.youtube.com/watch?v=... or https://youtu.be/...');
      return;
    }

    const nextSubcategory: SkillSubcategory = {
      title: form.title.trim(),
      goal: form.goal.trim() || 'Goal to be added.',
      steps: form.steps.trim() || 'Training steps to be added.',
      coachingNotes: form.coachingNotes.trim() || 'Coaching notes to be added.',
      youtubeUrl: form.youtubeUrl.trim(),
    };

    const nextSkills = skills.map((skill) =>
      skill.title === selectedSkill.title
        ? { ...skill, subcategories: [...skill.subcategories, nextSubcategory] }
        : skill,
    );

    saveSkills(nextSkills);
    setSelectedSubcategoryTitle(nextSubcategory.title);
    setForm(emptySubcategory);
  }

  function deleteCoreSkill(title: string) {
    if (!editable || skills.length <= 1) return;
    if (!window.confirm(`Delete "${title}" and all of its sub categories?`)) return;

    const nextSkills = skills.filter((skill) => skill.title !== title);
    const fallbackSkill = nextSkills[0];

    saveSkills(nextSkills);
    setSelectedSkillTitle(fallbackSkill.title);
    setSelectedSubcategoryTitle(fallbackSkill.subcategories[0]?.title || '');
    setCoreSkillMessage('Core subject deleted.');
    setMessage('');
  }

  function deleteSubcategory(title: string) {
    if (!editable || !selectedSkill) return;
    if (!window.confirm(`Delete "${title}" from ${selectedSkill.title}?`)) return;

    const nextSubcategories = selectedSkill.subcategories.filter((subcategory) => subcategory.title !== title);
    const nextSkills = skills.map((skill) =>
      skill.title === selectedSkill.title ? { ...skill, subcategories: nextSubcategories } : skill,
    );

    saveSkills(nextSkills);
    setSelectedSubcategoryTitle(nextSubcategories[0]?.title || '');
    setMessage('Sub category deleted.');
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[300px_1fr]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">Core skill heading</span>
            <select
              value={selectedSkill.title}
              onChange={(event) => chooseSkillByTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
            >
              {skills.map((skill) => (
                <option key={skill.title} value={skill.title}>
                  {skill.title}
                </option>
              ))}
            </select>
          </label>

          {editable ? (
            <button
              type="button"
              onClick={() => deleteCoreSkill(selectedSkill.title)}
              disabled={skills.length <= 1}
              className="mt-4 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete core skill
            </button>
          ) : null}
        </div>

        {editable ? (
          <form onSubmit={addCoreSkill} className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-brand-950">Add core subject</h3>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-brand-800">Title</span>
              <input
                value={coreSkillForm.title}
                onChange={(event) => setCoreSkillForm({ ...coreSkillForm, title: event.target.value })}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-brand-800">Summary</span>
              <textarea
                value={coreSkillForm.summary}
                onChange={(event) => setCoreSkillForm({ ...coreSkillForm, summary: event.target.value })}
                className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-full bg-brand-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-950"
            >
              Add core subject
            </button>
            {coreSkillMessage ? <p className="mt-3 text-sm text-brand-700">{coreSkillMessage}</p> : null}
          </form>
        ) : null}
      </div>

      <section className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-brand-700">Core skill</p>
          <h2 className="mt-1 text-2xl font-semibold text-brand-950">{selectedSkill.title}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-700">{selectedSkill.summary}</p>
        </div>

        {selectedSubcategory?.youtubeUrl ? (
          <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 text-brand-950 shadow-sm">
            {youtubeVideoId ? (
              <div className="aspect-video w-full max-w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title={`YouTube instruction for ${selectedSubcategory.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="block h-full w-full max-w-full border-0"
                />
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm font-semibold">Video preview unavailable</p>
                <a
                  href={selectedSubcategory.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block break-all text-xs text-brand-700 underline"
                >
                  {selectedSubcategory.youtubeUrl}
                </a>
              </div>
            )}
          </div>
        ) : null}

        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">Sub category</span>
            <select
              value={selectedSubcategory?.title || ''}
              onChange={(event) => chooseSubcategory(event.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2 text-brand-900"
            >
              {selectedSkill.subcategories.map((subcategory) => (
                <option key={subcategory.title} value={subcategory.title}>
                  {subcategory.title}
                </option>
              ))}
            </select>
          </label>
          {editable && selectedSubcategory ? (
            <button
              type="button"
              onClick={() => deleteSubcategory(selectedSubcategory.title)}
              className="mt-4 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Delete sub category
            </button>
          ) : null}
        </div>

        {selectedSubcategory ? (
          <>
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
            {editable ? (
              <>
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-brand-800">Title</span>
                    <input
                      value={selectedSubcategory.title}
                      onChange={(event) => updateSelectedSubcategory('title', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-brand-800">YouTube video link</span>
                    <input
                      value={selectedSubcategory.youtubeUrl}
                      onChange={(event) => updateSelectedSubcategory('youtubeUrl', event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-brand-800">Goal</span>
                  <textarea
                    value={selectedSubcategory.goal}
                    onChange={(event) => updateSelectedSubcategory('goal', event.target.value)}
                    className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="text-sm font-medium text-brand-800">Training details</span>
                  <textarea
                    value={selectedSubcategory.steps}
                    onChange={(event) => updateSelectedSubcategory('steps', event.target.value)}
                    className="mt-1 min-h-36 w-full rounded-lg border border-brand-200 px-3 py-2"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="text-sm font-medium text-brand-800">Coaching notes</span>
                  <textarea
                    value={selectedSubcategory.coachingNotes}
                    onChange={(event) => updateSelectedSubcategory('coachingNotes', event.target.value)}
                    className="mt-1 min-h-28 w-full rounded-lg border border-brand-200 px-3 py-2"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-brand-700">Goal</p>
                  <p className="mt-1 text-sm leading-6 text-brand-800">{selectedSubcategory.goal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-700">Training details</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-brand-800">{selectedSubcategory.steps}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-700">Coaching notes</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-brand-800">{selectedSubcategory.coachingNotes}</p>
                </div>
              </div>
            )}

            </div>
          </>
        ) : null}

        {editable ? (
          <form onSubmit={addSubcategory} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-brand-950">Add sub category</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-brand-800">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-brand-800">YouTube video link</span>
                <input
                  value={form.youtubeUrl}
                  onChange={(event) => setForm({ ...form, youtubeUrl: event.target.value })}
                  placeholder="https://youtu.be/..."
                  className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-brand-800">Goal</span>
              <textarea
                value={form.goal}
                onChange={(event) => setForm({ ...form, goal: event.target.value })}
                className="mt-1 min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-brand-800">Training details</span>
              <textarea
                value={form.steps}
                onChange={(event) => setForm({ ...form, steps: event.target.value })}
                className="mt-1 min-h-24 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-brand-800">Coaching notes</span>
              <textarea
                value={form.coachingNotes}
                onChange={(event) => setForm({ ...form, coachingNotes: event.target.value })}
                className="mt-1 min-h-20 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-full bg-brand-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-950"
            >
              Add sub category
            </button>
            {message ? <p className="mt-3 text-sm text-brand-700">{message}</p> : null}
          </form>
        ) : null}
      </section>
    </div>
  );
}
