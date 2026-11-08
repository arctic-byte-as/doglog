import type { CourseTemplate } from './course-templates';

/** Extend from Week 1 without replacing any weeks the trainer already edited. */
export function resizeCourseWeeks(weeks: CourseTemplate['weeks'], count: number): CourseTemplate['weeks'] | null {
  if (!weeks.length || !Number.isInteger(count) || count < 1 || count > 52) return null;
  return Array.from({ length: count }, (_, index) => index < weeks.length
    ? structuredClone(weeks[index])
    : { ...structuredClone(weeks[0]), title: `Week ${index + 1}` });
}
