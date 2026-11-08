import CourseSchedulingPreview from '@/components/CourseSchedulingPreview';
import prisma from '@/lib/prisma';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CoursesClient from '@/components/CoursesClient';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function CoursesPage() {
  const user = await requireTrainer();
  const preview = process.env.COURSE_SCHEDULING_PREVIEW === 'true' && process.env.VERCEL_ENV !== 'production';
  const [dogs, trainingEntries] = preview ? await Promise.all([
    prisma.dog.findMany({ where: { trainerId: user.trainer.id, customerId: { not: null } }, select: { id: true, name: true, customer: { select: { id: true, name: true } } }, orderBy: { name: 'asc' } }),
    prisma.trainingEntry.findMany({ where: { dog: { trainerId: user.trainer.id, customerId: { not: null } } }, select: { id: true, dogId: true, day: true, exerciseName: true, minutes: true, repetitions: true, completed: true }, orderBy: { day: 'asc' } }),
  ]) : [[], []];

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout activeHref="/services/courses">
            {preview ? <CourseSchedulingPreview dogs={dogs} trainingEntries={trainingEntries} today={new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })} /> : <CoursesClient />}
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
