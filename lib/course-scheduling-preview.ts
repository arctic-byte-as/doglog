export type CourseSessionPreview = { id: string; weekIndex: number; day: string; startTime: string; endTime: string };
export type CourseRunPreview = { id: string; courseId: string; name: string; location: string; dogIds: string[]; sessions: CourseSessionPreview[] };

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
