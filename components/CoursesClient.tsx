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

type CourseLocale = 'en' | 'nb';

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

const norwegianCourseText = {
  puppy: {
    title: 'Valpekurs',
    summary: 'Seks uker med valpegrunnlag basert på positiv forsterkning, sosial trygghet og praktisk støtte til eier.',
    weeks: [
      {
        title: 'Uke 1',
        focus: 'Introduksjon',
        details: 'Introduksjon til kjerneideer og forberedelser for moderne, belønningsbasert valpetrening.',
        activities: [
          'Introduksjon til moderne hundetrening.',
          'Forstå hundens kroppsspråk.',
          'Teknikker for positiv forsterkning.',
          'Effektiv bruk av godbiter.',
          'Forberedelser for å lykkes.',
          'Trening med bilbur.',
          'Roligtrening med Magic Mat.',
        ],
      },
      {
        title: 'Uke 2',
        focus: 'Kontakt og samarbeid',
        details: 'Bygg kontakt, samarbeid, frisignal, håndtering og tidlig posisjonsarbeid.',
        activities: [
          'Roligtrening - videreføring.',
          'Tilvenning til nye miljøer.',
          'Grunnleggende læringsteori.',
          'Kontakt 1, 2 og 3.',
          'Frisignal (OK).',
          'Håndtarget-teknikker.',
          'Midtposisjon.',
          'Håndtering på matten.',
        ],
      },
      {
        title: 'Uke 3',
        focus: 'Sosialisering',
        details: 'Utvikle sosial trygghet gjennom valg, kontroll, kontakt med mennesker, samspill med hunder, berøring, lek og snusing.',
        activities: [
          'Valg og kontroll.',
          'Skape kontakt med mennesker.',
          'Samspill med andre hunder.',
          'Utforske berøring.',
          'Delta i lek.',
          'Snurr.',
          'Gå og snus (superkraft).',
        ],
      },
      {
        title: 'Uke 4',
        focus: 'Sosialisering videre',
        details: 'Fortsett sosialiseringen med gå pent i bånd, rolige passeringer, miljømestring og varig kontakt.',
        activities: [
          'Gå pent i bånd.',
          'Mestre navigering i verden.',
          'Passere andre hunder rolig og med kontroll.',
          'Vanlige utfordringer og løsninger.',
          'Bygge kontakt over tid.',
          'Berøring og fokusteknikker.',
        ],
      },
      {
        title: 'Uke 5',
        focus: 'Innkalling',
        details: 'Bygg innkalling gjennom rolig fokus, trinnvis innkalling, verifisering og trygg testing.',
        activities: [
          'Ro og fokus.',
          'Innkalling - trinn 1, 2 og 3.',
          'Hvordan verifisere innkallingen.',
          'Hvordan teste innkalling trygt.',
        ],
      },
      {
        title: 'Uke 6',
        focus: 'Ta vare på hunden din',
        details: 'Fokus på stell, håndtering, pelspleie, kloklipp, veterinærbesøk og forståelse av valpens vekst og utvikling.',
        activities: [
          'Håndtering av hunden.',
          'Børsting og pelsstell.',
          'Kloklipp.',
          'Besøk hos veterinæren.',
          'Valpens vekst og utvikling.',
        ],
      },
    ],
  },
  skills: {
    title: 'Ferdighetskurs',
    summary: 'Seks ukers ferdighetskurs for hunder fra 9 måneder, med positiv forsterkning, valg og kontroll, og relasjonsbygging.',
    weeks: [
      {
        title: 'Uke 1',
        focus: 'Grunnferdigheter',
        details: 'Lær hvordan hunder lærer, og bygg felles treningsspråk, belønningsrutiner og rolige grunnferdigheter for resten av kurset.',
        activities: [
          'Hvordan hunder lærer.',
          'Positiv forsterkning.',
          'Markørord.',
          'Belønningsplassering.',
          'Engasjement.',
          'Magic Mat - rolig mattrening.',
          'OK / frisignal.',
        ],
      },
      {
        title: 'Uke 2',
        focus: 'Bygge engasjement',
        details: 'Utvikle praktiske engasjementsferdigheter slik at hunden kan orientere seg mot fører, følge enkle targeter og bygge fokus med god belønningstiming.',
        activities: [
          'Kontakt.',
          'Håndtarget.',
          'Belønningstiming.',
          'Bygge fokus og oppmerksomhet på fører.',
        ],
      },
      {
        title: 'Uke 3',
        focus: 'Trygghet og selvkontroll',
        details: 'Bruk grenser, posisjonering og valgbasert trening for å hjelpe hunden å bli tryggere samtidig som den lærer nyttig selvkontroll.',
        activities: [
          'Grenser - grensetrening.',
          'Midtposisjon - mellom beina.',
          'Valg og kontroll.',
        ],
      },
      {
        title: 'Uke 4',
        focus: 'Lek og innkalling',
        details: 'Utforsk ulike typer lek og bruk motivasjon, leker og belønningsbasert øving for å bygge de første lagene av innkalling.',
        activities: [
          'Ulike typer lek.',
          'Motivasjon.',
          'Belønning gjennom lek og spill.',
          'Grunnleggende innkalling.',
        ],
      },
      {
        title: 'Uke 5',
        focus: 'Gå pent i bånd',
        details: 'Lær hunden hvor belønning skjer, hvordan den kan følge fører, og hvordan den holder kontakt rundt hverdagslige forstyrrelser.',
        activities: [
          'Belønningssoner.',
          'Følge fører.',
          'Førerverdi - verdien av å være med fører.',
          'Miljøforstyrrelser og distraksjoner.',
        ],
      },
      {
        title: 'Uke 6',
        focus: 'Den virkelige verden',
        details: 'Sett kursferdighetene sammen for hverdagslig håndtering, problemløsning og en langsiktig plan for videre trening etter kurset.',
        activities: [
          'Kombinere ferdigheter.',
          'Hverdagslig håndtering.',
          'Problemløsning.',
          'Langsiktig suksess og videre treningsutvikling.',
        ],
      },
    ],
  },
} as const;

const courseUiText = {
  en: {
    activitiesHeading: 'Activities to concentrate on',
    addFocus: 'Add focus',
  },
  nb: {
    activitiesHeading: 'Aktiviteter å fokusere på',
    addFocus: 'Legg til fokus',
  },
} as const;

function localizeWeeks(weeks: CourseWeek[], courseId: 'puppy' | 'skills', locale: CourseLocale): CourseWeek[] {
  if (locale === 'en') return weeks;
  return weeks.map((week, index) => ({
    ...week,
    title: norwegianCourseText[courseId].weeks[index]?.title || week.title,
    focus: norwegianCourseText[courseId].weeks[index]?.focus || week.focus,
    details: norwegianCourseText[courseId].weeks[index]?.details || week.details,
    activities: norwegianCourseText[courseId].weeks[index]?.activities ? [...norwegianCourseText[courseId].weeks[index].activities] : week.activities,
  }));
}

export default function CoursesClient({
  initialCourseId = 'puppy',
  lockedCourse = false,
  locale = 'en',
}: {
  editable?: boolean;
  initialCourseId?: 'puppy' | 'skills';
  lockedCourse?: boolean;
  locale?: CourseLocale;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<'puppy' | 'skills'>(initialCourseId);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const courses: Course[] = [
    {
      id: 'puppy',
      title: locale === 'nb' ? norwegianCourseText.puppy.title : 'Puppy Course',
      summary: locale === 'nb' ? norwegianCourseText.puppy.summary : 'Six-week puppy foundations based on positive reinforcement, social confidence, and practical owner support.',
      weeks: localizeWeeks(puppyWeeks, 'puppy', locale),
    },
    {
      id: 'skills',
      title: locale === 'nb' ? norwegianCourseText.skills.title : 'Skills Course',
      summary: locale === 'nb' ? norwegianCourseText.skills.summary : 'Six-week skills course for dogs 9 months and older, using positive reinforcement, choice and control, and relationship-building.',
      weeks: localizeWeeks(defaultSkillsWeeks, 'skills', locale),
    },
  ];
  const uiText = courseUiText[locale];
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
              <h3 className="text-sm font-semibold text-brand-950">{uiText.activitiesHeading}</h3>
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
                    <h3 className="mt-1 text-base font-semibold leading-5 text-brand-950">{week.focus || uiText.addFocus}</h3>
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
