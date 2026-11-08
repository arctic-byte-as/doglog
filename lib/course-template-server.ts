import prisma from './prisma';
import { getCourses } from './courses';
import { parseCourseTemplate, type CourseTemplate } from './course-templates';
export const templateKey = (trainerId: string) => `course-templates:${trainerId}`;
export async function getCustomCourseTemplates(trainerId: string, db: Pick<typeof prisma, 'appContent'> = prisma) {
  const row = await db.appContent.findUnique({ where: { key: templateKey(trainerId) } });
  if (!row) return { templates: [] as CourseTemplate[], updatedAt: null as string | null };
  const value = JSON.parse(row.value);
  if (!Array.isArray(value) || value.some(item => !parseCourseTemplate(item))) throw new Error('Saved course templates could not be read.');
  return { templates: value.map(item => parseCourseTemplate(item)!), updatedAt: row.updatedAt.toISOString() };
}
export async function getTrainerCourseCatalog(trainerId: string, locale: 'en' | 'nb' = 'en', db: Pick<typeof prisma, 'appContent'> = prisma): Promise<CourseTemplate[]> {
  const builtin = getCourses(locale).map(course => ({ ...course, serviceKey: course.id === 'puppy' ? 'PUPPY_COURSE' as const : 'SKILLS_COURSE' as const, capacity: null, durationMinutes: 60 }));
  return [...builtin, ...(await getCustomCourseTemplates(trainerId, db)).templates];
}
