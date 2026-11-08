export const courseServiceTypes = [
  { key: 'OPEN_TRAINING', title: 'Open Training' },
  { key: 'PRIVATE_TRAINING', title: 'Private Training' },
  { key: 'PUPPY_COURSE', title: 'Puppy Course' },
  { key: 'SKILLS_COURSE', title: 'Skills Course' },
] as const;
export type CourseServiceType = typeof courseServiceTypes[number]['key'];
export type CourseTemplate = { id: string; title: string; summary: string; serviceKey: CourseServiceType; capacity: number | null; durationMinutes: number; weeks: { title: string; focus: string; details: string; activities?: string[]; image?: { src: string; alt: string } }[] };
export function parseCourseTemplate(value: unknown): CourseTemplate | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'string' || !/^custom-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.id) || typeof v.title !== 'string' || !v.title.trim() || v.title.length > 150 || typeof v.summary !== 'string' || v.summary.length > 2000 || !courseServiceTypes.some(type => type.key === v.serviceKey)) return null;
  if (v.capacity !== null && (!Number.isInteger(v.capacity) || (v.capacity as number) < 1 || (v.capacity as number) > 100)) return null;
  if (!Number.isInteger(v.durationMinutes) || (v.durationMinutes as number) < 15 || (v.durationMinutes as number) > 480 || !Array.isArray(v.weeks) || !v.weeks.length || v.weeks.length > 52) return null;
  const weeks = [];
  for (const week of v.weeks) {
    if (!week || ['title','focus','details'].some(key => typeof week[key] !== 'string') || !week.title.trim() || !week.focus.trim() || week.title.length > 100 || week.focus.length > 200 || week.details.length > 5000 || !Array.isArray(week.activities) || week.activities.length > 30 || week.activities.some((item: unknown) => typeof item !== 'string' || item.length > 500)) return null;
    weeks.push({ title: week.title.trim(), focus: week.focus.trim(), details: week.details.trim(), activities: week.activities.map((item: string) => item.trim()).filter(Boolean) });
  }
  return { id: v.id, title: v.title.trim(), summary: v.summary.trim(), serviceKey: v.serviceKey as CourseServiceType, capacity: v.capacity as number | null, durationMinutes: v.durationMinutes as number, weeks };
}
