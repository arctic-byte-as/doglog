"use client";

import Image from 'next/image';
import { useState } from 'react';

type CourseWeek = {
  title: string;
  focus: string;
  details: string;
  image: {
    src: string;
    alt: string;
  };
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
    image: {
      src: '/course-images/thumbnails/puppy-week-1.jpg',
      alt: 'Puppy course introduction training image from Norse Paw',
    },
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
    image: {
      src: '/course-images/thumbnails/puppy-week-2.jpg',
      alt: 'Puppy course contact and cooperation training image from Norse Paw',
    },
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
    image: {
      src: '/course-images/thumbnails/puppy-week-3.jpg',
      alt: 'Puppy course socialisation training image from Norse Paw',
    },
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
    image: {
      src: '/course-images/thumbnails/puppy-week-4.jpg',
      alt: 'Puppy course continued socialisation training image from Norse Paw',
    },
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
    image: {
      src: '/course-images/thumbnails/puppy-week-5.jpg',
      alt: 'Puppy course recall training image from Norse Paw',
    },
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
    image: {
      src: '/course-images/thumbnails/puppy-week-6.jpg',
      alt: 'Puppy course dog care training image from Norse Paw',
    },
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
  {
    title: 'Week 1',
    focus: 'Foundation skills',
    details:
      'Learn how dogs learn and set up the shared training language, reward routines, and calm foundations that support the rest of the course.',
    image: {
      src: '/course-images/thumbnails/skills-week-1.jpg',
      alt: 'Skills course foundation skills training image from Norse Paw',
    },
    activities: [
      'How dogs learn.',
      'Positive reinforcement.',
      'Marker words.',
      'Reward placement.',
      'Engagement.',
      'Magic Mat - calm mat training.',
      'OK / release cue.',
    ],
  },
  {
    title: 'Week 2',
    focus: 'Building engagement',
    details:
      'Develop practical engagement skills so the dog can orient to the handler, follow simple targets, and build focus through well-timed rewards.',
    image: {
      src: '/course-images/thumbnails/skills-week-2.jpg',
      alt: 'Skills course building engagement training image from Norse Paw',
    },
    activities: [
      'Contact.',
      'Hand target.',
      'Reward timing.',
      'Building focus and attention on the handler.',
    ],
  },
  {
    title: 'Week 3',
    focus: 'Confidence and self-control',
    details:
      'Use boundaries, positioning, and choice-based training to help the dog grow in confidence while learning useful self-control.',
    image: {
      src: '/course-images/thumbnails/skills-week-3.jpg',
      alt: 'Skills course confidence and self-control training image from Norse Paw',
    },
    activities: [
      'Boundaries - boundary training.',
      'Middle position - between the legs.',
      'Choice and control.',
    ],
  },
  {
    title: 'Week 4',
    focus: 'Play and recall',
    details:
      'Explore different types of play and use motivation, games, and reward-based practice to build the first layers of recall.',
    image: {
      src: '/course-images/thumbnails/skills-week-4.jpg',
      alt: 'Skills course play and recall training image from Norse Paw',
    },
    activities: [
      'Different types of play.',
      'Motivation.',
      'Rewarding through play and games.',
      'Basic recall.',
    ],
  },
  {
    title: 'Week 5',
    focus: 'Loose leash walking',
    details:
      'Teach the dog where reinforcement happens, how to follow the handler, and how to stay connected around everyday environmental distractions.',
    image: {
      src: '/course-images/thumbnails/skills-week-5.jpg',
      alt: 'Skills course loose leash walking training image from Norse Paw',
    },
    activities: [
      'Reward zones.',
      'Following the handler.',
      'Handler value - the value of being with the handler.',
      'Environmental disturbances and distractions.',
    ],
  },
  {
    title: 'Week 6',
    focus: 'The real world',
    details:
      'Bring the course skills together for everyday handling, problem solving, and a long-term plan for continuing training after the course.',
    image: {
      src: '/course-images/thumbnails/skills-week-6.jpg',
      alt: 'Skills course real-world training image from Norse Paw',
    },
    activities: [
      'Combining skills.',
      'Everyday handling.',
      'Problem solving.',
      'Long-term success and continued training development.',
    ],
  },
];

export default function CoursesClient({
  initialCourseId = 'puppy',
  lockedCourse = false,
}: {
  editable?: boolean;
  initialCourseId?: 'puppy' | 'skills';
  lockedCourse?: boolean;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<'puppy' | 'skills'>(initialCourseId);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

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
      summary: 'Six-week skills course for dogs 9 months and older, using positive reinforcement, choice and control, and relationship-building.',
      weeks: defaultSkillsWeeks,
    },
  ];
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];
  const selectedWeek = selectedCourse.weeks[selectedWeekIndex] || selectedCourse.weeks[0];

  function renderWeekDetail(className: string) {
    return (
      <section className={className}>
        <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl border border-brand-100 bg-brand-50">
          <Image
            src={selectedWeek.image.src}
            alt={selectedWeek.image.alt}
            fill
            sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <p className="text-sm font-medium text-brand-700">{selectedCourse.title}</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-950">{selectedWeek.title}</h2>

        <div className="mt-5 space-y-4">
          <h3 className="text-lg font-semibold text-brand-950">{selectedWeek.focus}</h3>
          <p className="text-sm leading-6 text-brand-700">{selectedWeek.details}</p>
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

      <div className="grid gap-6 md:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)]">
        <section className="space-y-3">
          {selectedCourse.weeks.map((week, index) => (
            <div key={`${week.title}-${index}`} className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedWeekIndex(index)}
                className={`min-h-32 w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-brand-300 md:min-h-0 md:p-3 ${
                  selectedWeekIndex === index ? 'border-brand-700' : 'border-brand-200'
                }`}
              >
                <div className="flex items-center gap-4 md:gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-100 bg-brand-50 md:h-12 md:w-12">
                    <Image src={week.image.src} alt={week.image.alt} fill sizes="(min-width: 768px) 48px, 64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-700">{week.title}</p>
                    <h3 className="mt-1 text-base font-semibold leading-5 text-brand-950">{week.focus || 'Add focus'}</h3>
                  </div>
                </div>
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
