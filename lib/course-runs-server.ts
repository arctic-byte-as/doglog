import { getTrainerCourseCatalog } from './course-template-server';
import prisma from './prisma';
import { getCourses } from './courses';
import type { CourseRunPreview } from './course-scheduling-preview';
const include = { sessions: { orderBy: [{ day: 'asc' as const }, { startTime: 'asc' as const }] }, enrollments: { select: { dogId: true } } };
export async function getTrainerCourseRuns(trainerId: string): Promise<CourseRunPreview[]> {
  const runs = await prisma.courseRun.findMany({ where: { trainerId }, include, orderBy: { createdAt: 'desc' } });
  return runs.map(run => ({ id: run.id, courseId: run.courseId, name: run.name, location: run.location, cadenceWeeks: run.cadenceWeeks, updatedAt: run.updatedAt.toISOString(), dogIds: run.enrollments.map(item => item.dogId), sessions: run.sessions.map(({ id, weekIndex, day, startTime, endTime }) => ({ id, weekIndex, day, startTime, endTime })) }));
}
export type CustomerCourseEvent = { id: string; day: string; startTime: string; endTime: string; title: string; weekTitle: string; focus: string; details: string; activities: string[]; location: string; dogIds: string[]; courseId: string; serviceKey?: string };
export async function getCustomerCourseEvents(customerId: string, locale: 'en' | 'nb' = 'en'): Promise<CustomerCourseEvent[]> {
  const ownership = { customerId, dog: { customerId } };
  const sessions = await prisma.courseSession.findMany({ where: { run: { enrollments: { some: ownership } } }, include: { run: { include: { enrollments: { where: ownership, select: { dogId: true } } } } }, orderBy: [{ day: 'asc' }, { startTime: 'asc' }] });
  const catalogs = new Map<string, Awaited<ReturnType<typeof getTrainerCourseCatalog>>>();
  const trainerIds = [...new Set(sessions.filter(session => session.run.courseId.startsWith('custom-')).map(session => session.run.trainerId))];
  await Promise.all(trainerIds.map(async trainerId => catalogs.set(trainerId, await getTrainerCourseCatalog(trainerId, locale))));
  const courses = getCourses(locale);
  return sessions.flatMap(session => {
    const custom = catalogs.get(session.run.trainerId)?.find(course => course.id === session.run.courseId);
    const course = custom || courses.find(course => course.id === session.run.courseId);
    const week = course?.weeks[session.weekIndex];
    return course && week ? [{ id: session.id, day: session.day, startTime: session.startTime, endTime: session.endTime, title: session.run.name, courseId: course.id, serviceKey: custom?.serviceKey || (course.id === 'puppy' ? 'PUPPY_COURSE' : 'SKILLS_COURSE'), weekTitle: week.title, focus: week.focus, details: week.details, activities: week.activities || [], location: session.run.location, dogIds: session.run.enrollments.map(item => item.dogId) }] : [];
  });
}
