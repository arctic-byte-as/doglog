import { normalizeTrainingLibrary, type Exercise } from './training-library';

export type CourseLibraryExercise = { category: string; exercise: Exercise };
export const courseServiceTypes = [
  { key: 'OPEN_TRAINING', title: 'Open Training' },
  { key: 'PRIVATE_TRAINING', title: 'Private Training' },
  { key: 'PUPPY_COURSE', title: 'Puppy Course' },
  { key: 'SKILLS_COURSE', title: 'Skills Course' },
] as const;
export type CourseServiceType = typeof courseServiceTypes[number]['key'];
export type CourseTemplate = { id: string; title: string; summary: string; serviceKey: CourseServiceType; capacity: number | null; durationMinutes: number; weeks: { title: string; focus: string; details: string; activities?: string[]; libraryExercises?: CourseLibraryExercise[]; image?: { src: string; alt: string } }[] };
export function parseCourseTemplate(value: unknown): CourseTemplate | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'string' || !/^custom-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.id) || typeof v.title !== 'string' || !v.title.trim() || v.title.length > 150 || typeof v.summary !== 'string' || v.summary.length > 2000 || !courseServiceTypes.some(type => type.key === v.serviceKey)) return null;
  if (v.capacity !== null && (!Number.isInteger(v.capacity) || (v.capacity as number) < 1 || (v.capacity as number) > 100)) return null;
  if (!Number.isInteger(v.durationMinutes) || (v.durationMinutes as number) < 15 || (v.durationMinutes as number) > 480 || !Array.isArray(v.weeks) || !v.weeks.length || v.weeks.length > 52) return null;
  const weeks = [];
  for (const week of v.weeks) {
    if (!week || ['title','focus','details'].some(key => typeof week[key] !== 'string') || !week.title.trim() || !week.focus.trim() || week.title.length > 100 || week.focus.length > 200 || week.details.length > 5000 || !Array.isArray(week.activities) || week.activities.length > 30 || week.activities.some((item: unknown) => typeof item !== 'string' || item.length > 500)) return null;
    let libraryExercises: CourseLibraryExercise[] | undefined;
    if (week.libraryExercises !== undefined) {
      if (!Array.isArray(week.libraryExercises) || week.libraryExercises.length > 20) return null;
      libraryExercises = [];
      const seen = new Set<string>();
      for (const item of week.libraryExercises) {
        if (!item || typeof item.category !== 'string' || !item.category.trim() || item.category.length > 200 || JSON.stringify(item).length > 30000) return null;
        const normalized = normalizeTrainingLibrary([{ title: item.category, summary: '', exercises: [item.exercise] }]);
        if (!normalized || normalized[0].exercises[0].title.length > 500) return null;
        const category = normalized[0].title, exercise = normalized[0].exercises[0];
        const identity = JSON.stringify([category.toLowerCase(), exercise.title.toLowerCase()]);
        if (seen.has(identity)) return null;
        seen.add(identity);
        libraryExercises.push({ category, exercise });
      }
    }
    weeks.push({ title: week.title.trim(), focus: week.focus.trim(), details: week.details.trim(), activities: week.activities.map((item: string) => item.trim()).filter(Boolean), ...(libraryExercises !== undefined ? { libraryExercises } : {}) });
  }
  return { id: v.id, title: v.title.trim(), summary: v.summary.trim(), serviceKey: v.serviceKey as CourseServiceType, capacity: v.capacity as number | null, durationMinutes: v.durationMinutes as number, weeks };
}
