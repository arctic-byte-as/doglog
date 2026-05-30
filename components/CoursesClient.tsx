"use client";

import { useEffect, useState } from 'react';

type CourseWeek = {
  title: string;
  focus: string;
  details: string;
  activities?: string[];
};

type Course = {
  id: 'puppy' | 'skills';
  title: string;
  summary: string;
  weeks: CourseWeek[];
};

const puppyWeeks: CourseWeek[] = [
  {
    title: 'Week 1',
    focus: 'Introduction',
    details:
      'Introduction to the core ideas and preparation needed for modern, reward-based puppy training.',
    activities: [
      'Introduction to modern dog training.',
      'Understand dog body language.',
      'Positive reinforcement techniques.',
      'Effective use of treats.',
      'Preparations for success.',
      'Car crate training.',
      'Calm training with Magic Mat.',
    ],
  },
  {
    title: 'Week 2',
    focus: 'Contact and cooperation',
    details:
      'Build contact, cooperation, release cues, handling skills, and early positioning work.',
    activities: [
      'Calm training - continuation.',
      'Habituation to new environments.',
      'Basic learning theory.',
      'Contact 1, 2 and 3.',
      'Release cue (OK).',
      'Hand target techniques.',
      'Middle position.',
      'Handling skills on the mat.',
    ],
  },
  {
    title: 'Week 3',
    focus: 'Socialisation',
    details:
      'Develop social confidence through choice, control, people contact, dog interaction, touch, play, and sniffing.',
    activities: [
      'Choice and control.',
      'Creating contact with people.',
      'Interaction with other dogs.',
      'Exploring touch.',
      'Engaging in play.',
      'Spin.',
      'Go and sniff (superpower).',
    ],
  },
  {
    title: 'Week 4',
    focus: 'Socialisation continued',
    details:
      'Continue socialisation with loose leash walking, calm passing, world navigation, and sustained contact.',
    activities: [
      'Loose leash walking.',
      'Mastering navigation in the world.',
      'Passing other dogs calmly and with control.',
      'Common challenges and solutions.',
      'Building contact over time.',
      'Touch and focus techniques.',
    ],
  },
  {
    title: 'Week 5',
    focus: 'Recall',
    details:
      'Build recall through calm focus, progressive recall stages, verification, and safe testing.',
    activities: [
      'Calm and focus.',
      'Recall - stages 1, 2 and 3.',
      'How to verify your recall.',
      'How to test recall safely.',
    ],
  },
  {
    title: 'Week 6',
    focus: 'Taking care of your dog',
    details:
      'Focus on care, handling, grooming, nail clipping, veterinary visits, and understanding puppy growth and development.',
    activities: [
      'Handling your dog.',
      'Brushing and coat care.',
      'Nail clipping.',
      'Visits to the vet.',
      'Puppy growth and development.',
    ],
  },
];

const defaultSkillsWeeks: CourseWeek[] = [
  { title: 'Week 1', focus: '', details: '' },
  { title: 'Week 2', focus: '', details: '' },
  { title: 'Week 3', focus: '', details: '' },
  { title: 'Week 4', focus: '', details: '' },
  { title: 'Week 5', focus: '', details: '' },
  { title: 'Week 6', focus: '', details: '' },
];

const storageKey = 'norsepaw-skills-course-weeks';

export default function CoursesClient({
  editable = true,
  initialCourseId = 'puppy',
  lockedCourse = false,
}: {
  editable?: boolean;
  initialCourseId?: 'puppy' | 'skills';
  lockedCourse?: boolean;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<'puppy' | 'skills'>(initialCourseId);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [skillsWeeks, setSkillsWeeks] = useState(defaultSkillsWeeks);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as CourseWeek[];
      if (Array.isArray(parsed) && parsed.length === 6) setSkillsWeeks(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  function saveSkillsWeeks(nextWeeks: CourseWeek[]) {
    setSkillsWeeks(nextWeeks);
    window.localStorage.setItem(storageKey, JSON.stringify(nextWeeks));
  }

  const courses: Course[] = [
    {
      id: 'puppy',
      title: 'Puppy Course',
      summary: 'Six-week puppy foundations based on positive reinforcement, social confidence, and practical owner support.',
      weeks: puppyWeeks,
    },
    {
      id: 'skills',
      title: 'Skills Course',
      summary: 'Editable six-week skills course template for future course planning.',
      weeks: skillsWeeks,
    },
  ];
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];
  const selectedWeek = selectedCourse.weeks[selectedWeekIndex] || selectedCourse.weeks[0];

  function updateSkillWeek(field: keyof CourseWeek, value: string) {
    if (!editable) return;

    const nextWeeks = skillsWeeks.map((week, index) => (index === selectedWeekIndex ? { ...week, [field]: value } : week));
    saveSkillsWeeks(nextWeeks);
  }

  function renderWeekDetail(className: string) {
    return (
      <section className={className}>
        <p className="text-sm font-medium text-brand-700">{selectedCourse.title}</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-950">{selectedWeek.title}</h2>

        {selectedCourse.id === 'skills' && editable ? (
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-brand-800">Week title</span>
              <input
                value={selectedWeek.title}
                onChange={(event) => updateSkillWeek('title', event.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-brand-800">Focus</span>
              <input
                value={selectedWeek.focus}
                onChange={(event) => updateSkillWeek('focus', event.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-brand-800">Details</span>
              <textarea
                value={selectedWeek.details}
                onChange={(event) => updateSkillWeek('details', event.target.value)}
                className="mt-1 min-h-48 w-full rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <h3 className="text-lg font-semibold text-brand-950">{selectedWeek.focus || 'Focus to be added'}</h3>
            <p className="text-sm leading-6 text-brand-700">
              {selectedWeek.details || 'Details will be added by your trainer.'}
            </p>
            {selectedWeek.activities?.length ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <h3 className="text-sm font-semibold text-brand-950">Activities to concentrate on</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-700">
                  {selectedWeek.activities.map((activity) => (
                    <li key={activity}>- {activity}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {lockedCourse ? (
        <div className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-950 shadow-sm">
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-700">{selectedCourse.summary}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedWeekIndex(0);
              }}
              className={`flex min-h-36 flex-col justify-between rounded-3xl border bg-white p-6 text-left text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft ${
                selectedCourse.id === course.id ? 'border-brand-700' : 'border-brand-200'
              }`}
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="mt-4 text-sm leading-6 text-brand-700">{course.summary}</p>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
          {selectedCourse.weeks.map((week, index) => (
            <div key={`${week.title}-${index}`} className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedWeekIndex(index)}
                className={`min-h-32 w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-brand-300 ${
                  selectedWeekIndex === index ? 'border-brand-700' : 'border-brand-200'
                }`}
              >
                <p className="text-sm font-medium text-brand-700">{week.title}</p>
                <h3 className="mt-2 font-semibold text-brand-950">{week.focus || 'Add focus'}</h3>
              </button>
              {selectedWeekIndex === index
                ? renderWeekDetail('rounded-2xl border border-brand-200 bg-white p-5 shadow-sm md:hidden')
                : null}
            </div>
          ))}
        </section>

        {renderWeekDetail('hidden rounded-2xl border border-brand-200 bg-white p-6 shadow-sm md:block')}
      </div>
    </div>
  );
}
