import { getTrainerCourseRuns } from '@/lib/course-runs-server';
import CourseSchedulingPreview from '@/components/CourseSchedulingPreview';
import prisma from '@/lib/prisma';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function CoursesPage() {
  const user = await requireTrainer();
  const [dogs, trainingEntries, runs] = await Promise.all([
    prisma.dog.findMany({ where: { trainerId: user.trainer.id, customerId: { not: null } }, select: { id: true, name: true, customer: { select: { id: true, name: true } } }, orderBy: { name: 'asc' } }),
    prisma.trainingEntry.findMany({ where: { dog: { trainerId: user.trainer.id, customerId: { not: null } } }, select: { id: true, dogId: true, day: true, exerciseName: true, minutes: true, repetitions: true, completed: true }, orderBy: { day: 'asc' } }),
    getTrainerCourseRuns(user.trainer.id),
  ]);

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout activeHref="/services/courses">
            <CourseSchedulingPreview persist initialRuns={runs} dogs={dogs} trainingEntries={trainingEntries} today={new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })} />
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
