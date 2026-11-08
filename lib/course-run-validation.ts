import { getCourses } from './courses';
import { validCoursePreviewSession, type CourseRunPreview } from './course-scheduling-preview';
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export function parseCourseRun(value: unknown, catalog: { id: string; weeks: { title: string }[] }[] = getCourses('en')): CourseRunPreview | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  const course = catalog.find(item => item.id === v.courseId);
  if (!course || !uuid(v.id) || typeof v.name !== 'string' || !v.name.trim() || v.name.length > 150 || typeof v.location !== 'string' || v.location.length > 200 || ![0,1,2].includes(v.cadenceWeeks as number)) return null;
  if (!Array.isArray(v.dogIds) || v.dogIds.length > 100 || v.dogIds.some(id => typeof id !== 'string' || !id || id.length > 200) || new Set(v.dogIds).size !== v.dogIds.length) return null;
  if (!Array.isArray(v.sessions) || !v.sessions.length || v.sessions.length > 52) return null;
  const sessions = [];
  for (const item of v.sessions) {
    if (!item || typeof item !== 'object' || !uuid(item.id) || typeof item.day !== 'string' || typeof item.startTime !== 'string' || typeof item.endTime !== 'string' || !validCoursePreviewSession(item, course.weeks.length)) return null;
    sessions.push({ id: item.id, day: item.day, startTime: item.startTime, endTime: item.endTime, weekIndex: item.weekIndex });
  }
  if (new Set(sessions.map(item => item.id)).size !== sessions.length) return null;
  if (v.updatedAt !== undefined && (typeof v.updatedAt !== 'string' || !Number.isFinite(Date.parse(v.updatedAt)))) return null;
  return { id: v.id, courseId: course.id, name: v.name.trim(), location: v.location.trim(), cadenceWeeks: v.cadenceWeeks as number, dogIds: v.dogIds as string[], sessions, ...(v.updatedAt ? { updatedAt: v.updatedAt as string } : {}) };
}
