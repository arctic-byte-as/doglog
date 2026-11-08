export type CourseSessionPreview = { id: string; weekIndex: number; day: string; startTime: string; endTime: string };
export type CourseRunPreview = { id: string; courseId: string; name: string; location: string; dogIds: string[]; cadenceWeeks?: number; sessions: CourseSessionPreview[] };

export function validCourseTimeRange(start: string, end: string) {
  const valid = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  return valid(start) && valid(end) && end > start;
}
export function coursePreviewDays(startDay: string, weeks: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDay) || !Number.isInteger(weeks) || weeks < 1 || weeks > 52) return null;
  const start = new Date(`${startDay}T12:00:00Z`);
  if (!Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== startDay) return null;
  const days = Array.from({ length: weeks }, (_, index) => { const date = new Date(start); date.setUTCDate(date.getUTCDate() + index * 7); return date.toISOString().slice(0, 10); });
  return days.every((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)) ? days : null;
}

export function courseSessionOverlaps(a: CourseSessionPreview, b: CourseSessionPreview) {
  return a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime;
}

export function validCoursePreviewSession(session: CourseSessionPreview, weekCount: number) {
  return Number.isInteger(session.weekIndex) && session.weekIndex >= 0 && session.weekIndex < weekCount
    && coursePreviewDays(session.day, 1) !== null && validCourseTimeRange(session.startTime, session.endTime);
}

export function applyCourseCadence(sessions: CourseSessionPreview[], intervalWeeks: number): CourseSessionPreview[] | null {
  if (![0, 1, 2].includes(intervalWeeks) || !sessions.length) return null;
  if (intervalWeeks === 0) return sessions.map((session) => ({ ...session }));
  const firstDay = sessions[0].day;
  const dates = coursePreviewDays(firstDay, (sessions.length - 1) * intervalWeeks + 1);
  if (!dates) return null;
  return sessions.map((session, index) => ({ ...session, day: dates[index * intervalWeeks] }));
}
