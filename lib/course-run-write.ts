import prisma from './prisma';
import { parseCourseRun } from './course-run-validation';
import { getTrainerCourseRuns } from './course-runs-server';
export class CourseWriteError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function writeCourseRun(trainerId: string, body: unknown, id?: string) {
  const data = parseCourseRun(body);
  if (!data || (id && data.id !== id)) throw new CourseWriteError('Check the course, group name, sessions and participants.', 400);
  await prisma.$transaction(async tx => {
    const dogs = await tx.dog.findMany({ where: { id: { in: data.dogIds }, trainerId, customerId: { not: null } }, select: { id: true, customerId: true } });
    if (dogs.length !== data.dogIds.length) throw new CourseWriteError('One or more dogs are not assigned to you or have no owner account.', 403);
    const fields = { courseId: data.courseId, name: data.name, location: data.location, cadenceWeeks: data.cadenceWeeks, timezone: 'Europe/Oslo' };
    if (id) {
      if (!data.updatedAt) throw new CourseWriteError('Reopen this group before saving.', 409);
      const result = await tx.courseRun.updateMany({ where: { id, trainerId, updatedAt: new Date(data.updatedAt) }, data: fields });
      if (!result.count) throw new CourseWriteError('This group changed or is unavailable. Reload before editing.', 409);
      await tx.courseSession.deleteMany({ where: { runId: id } });
      await tx.courseEnrollment.deleteMany({ where: { runId: id } });
    } else {
      await tx.courseRun.create({ data: { id: data.id, trainerId, ...fields } });
    }
    await tx.courseSession.createMany({ data: data.sessions.map(session => ({ ...session, runId: data.id })) });
    if (dogs.length) {
      await tx.courseEnrollment.createMany({ data: dogs.map(dog => ({ runId: data.id, dogId: dog.id, customerId: dog.customerId! })) });
      await tx.customerServiceAccess.createMany({ data: [...new Set(dogs.map(dog => dog.customerId!))].map(customerId => ({ customerId, serviceKey: data.courseId === 'puppy' ? 'PUPPY_COURSE' : 'SKILLS_COURSE' })), skipDuplicates: true });
    }
  });
  return (await getTrainerCourseRuns(trainerId)).find(run => run.id === data.id)!;
}
