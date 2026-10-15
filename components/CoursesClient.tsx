"use client";

import Image from 'next/image';
import { useState } from 'react';

import { getCourses, courseUiText, type CourseId, type CourseLocale } from '@/lib/courses';

export default function CoursesClient({
  initialCourseId = 'puppy',
  lockedCourse = false,
  locale = 'en',
  availableCourseIds,
}: {
  editable?: boolean;
  initialCourseId?: CourseId;
  lockedCourse?: boolean;
  locale?: CourseLocale;
  availableCourseIds?: CourseId[];
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(initialCourseId);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const courses = getCourses(locale);
  const visibleCourses = availableCourseIds?.length
    ? courses.filter((course) => availableCourseIds.includes(course.id))
    : courses;
  const uiText = courseUiText[locale];
  const selectedCourse = visibleCourses.find((course) => course.id === selectedCourseId) || visibleCourses[0] || courses[0];
  const selectedWeek = selectedCourse.weeks[selectedWeekIndex] || selectedCourse.weeks[0];
  const showCourseSwitcher = !lockedCourse || visibleCourses.length > 1;

  function renderWeekDetail(className: string) {
    return (
      <section className={className}>
        <div className="relative mb-5 aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-brand-100 bg-brand-50">
          <Image
            src={selectedWeek.image.src}
            alt={selectedWeek.image.alt}
            fill
            sizes="(min-width: 768px) 448px, calc(100vw - 48px)"
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
      {!showCourseSwitcher ? (
        <div className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-950 shadow-sm">
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
          <p className="mt-3 text-sm leading-6 text-brand-700">{selectedCourse.summary}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">{uiText.courseLabel}</span>
            <select
              value={selectedCourse.id}
              onChange={(event) => {
                setSelectedCourseId(event.target.value as CourseId);
                setSelectedWeekIndex(0);
              }}
              className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
            >
              {visibleCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-sm leading-6 text-brand-700">{selectedCourse.summary}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
          <label className="block min-w-0">
            <span className="text-sm font-medium text-brand-800">{uiText.weekLabel}</span>
            <select
              value={selectedWeekIndex}
              onChange={(event) => setSelectedWeekIndex(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
            >
              {selectedCourse.weeks.map((week, index) => (
                <option key={`${week.title}-${index}`} value={index}>
                  {week.title} - {week.focus || uiText.addFocus}
                </option>
              ))}
            </select>
          </label>
        </div>

        {renderWeekDetail('rounded-2xl border border-brand-200 bg-white p-5 shadow-sm md:p-6')}
      </div>
    </div>
  );
}
