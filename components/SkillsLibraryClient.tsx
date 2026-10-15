"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CoreSkill, SkillSubcategory } from '@/lib/skills-library';

const legacyStorageKey = 'norsepaw-skills-library';

type SkillsLibraryLocale = 'en' | 'nb';

import { defaultSkills } from '@/lib/skills-library-defaults';

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

const defaultSkillsLibraryLabels = {
  coreSkillHeading: 'Core skill heading',
  coreSkill: 'Core skill',
  subcategory: 'Sub category',
  goal: 'Goal',
  trainingDetails: 'Training details',
  coachingNotes: 'Coaching notes',
  videoUnavailable: 'Video preview unavailable',
};

function translatedSkill(skill: CoreSkill | undefined, locale: SkillsLibraryLocale) {
  if (!skill) return null;
  if (locale !== 'nb') return skill;

  const translation = skill.translations?.nb;
  return {
    ...skill,
    title: translation?.title || skill.title,
    summary: translation?.summary || skill.summary,
  };
}

function translatedSubcategory(subcategory: SkillSubcategory | undefined, locale: SkillsLibraryLocale) {
  if (!subcategory) return null;
  if (locale !== 'nb') return subcategory;

  const translation = subcategory.translations?.nb;
  return {
    ...subcategory,
    title: translation?.title || subcategory.title,
    goal: translation?.goal || subcategory.goal,
    steps: translation?.steps || subcategory.steps,
    coachingNotes: translation?.coachingNotes || subcategory.coachingNotes,
  };
}

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

export default function SkillsLibraryClient({
  editable = true,
  labels = defaultSkillsLibraryLabels,
  locale = 'en',
}: {
  editable?: boolean;
  labels?: typeof defaultSkillsLibraryLabels;
  locale?: SkillsLibraryLocale;
}) {
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
  const displayedSkill = translatedSkill(selectedSkill, locale);
  const displayedSubcategory = translatedSubcategory(selectedSubcategory, locale);

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
            <span className="text-sm font-medium text-brand-800">{labels.coreSkillHeading}</span>
            <select
              value={selectedSkill.title}
              onChange={(event) => chooseSkillByTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
            >
              {skills.map((skill) => (
                <option key={skill.title} value={skill.title}>
                  {translatedSkill(skill, locale)?.title || skill.title}
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
        {selectedSubcategory?.youtubeUrl ? (
          <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 text-brand-950 shadow-sm">
            {youtubeVideoId ? (
              <div className="aspect-video w-full max-w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title={`YouTube instruction for ${displayedSubcategory?.title || selectedSubcategory.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="block h-full w-full max-w-full border-0"
                />
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm font-semibold">{labels.videoUnavailable}</p>
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
          <p className="text-sm font-medium text-brand-700">{labels.coreSkill}</p>
          <h2 className="mt-1 text-2xl font-semibold text-brand-950">{displayedSkill?.title || selectedSkill.title}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-700">{displayedSkill?.summary || selectedSkill.summary}</p>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">{labels.subcategory}</span>
            <select
              value={selectedSubcategory?.title || ''}
              onChange={(event) => chooseSubcategory(event.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2 text-brand-900"
            >
              {selectedSkill.subcategories.map((subcategory) => (
                <option key={subcategory.title} value={subcategory.title}>
                  {translatedSubcategory(subcategory, locale)?.title || subcategory.title}
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
                  <p className="text-sm font-medium text-brand-700">{labels.goal}</p>
                  <p className="mt-1 text-sm leading-6 text-brand-800">{displayedSubcategory?.goal || selectedSubcategory.goal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-700">{labels.trainingDetails}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-brand-800">{displayedSubcategory?.steps || selectedSubcategory.steps}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-700">{labels.coachingNotes}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-brand-800">
                    {displayedSubcategory?.coachingNotes || selectedSubcategory.coachingNotes}
                  </p>
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
