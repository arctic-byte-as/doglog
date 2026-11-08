import Link from 'next/link';
import { getTrainerCourseCatalog } from '@/lib/course-template-server';
import { courseServiceTypes } from '@/lib/course-templates';
import { getTrainerCourseRuns } from '@/lib/course-runs-server';
import CourseSchedulingPreview from '@/components/CourseSchedulingPreview';
import prisma from '@/lib/prisma';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ courseId?: string; service?: string }> }) {
  const user = await requireTrainer();
  const params = await searchParams;
  const [dogs, trainingEntries, runs, catalog] = await Promise.all([
    prisma.dog.findMany({ where: { trainerId: user.trainer.id, customerId: { not: null } }, select: { id: true, name: true, customer: { select: { id: true, name: true } } }, orderBy: { name: 'asc' } }),
    prisma.trainingEntry.findMany({ where: { dog: { trainerId: user.trainer.id, customerId: { not: null } } }, select: { id: true, dogId: true, day: true, exerciseName: true, minutes: true, repetitions: true, completed: true }, orderBy: { day: 'asc' } }),
    getTrainerCourseRuns(user.trainer.id),
    getTrainerCourseCatalog(user.trainer.id),
  ]);

  const service = courseServiceTypes.find(item => item.key === params.service);
  const available = service ? catalog.filter(course => course.serviceKey === service.key) : catalog;
  const availableRuns = runs.filter(run => available.some(course => course.id === run.courseId));
  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout activeHref="/services/courses">
            <div className="space-y-5"><Link href="/course-builder" className="inline-flex min-h-11 items-center rounded-full border border-brand-200 px-5 py-2 font-semibold">Build a new course →</Link>{service ? <h2 className="text-xl font-semibold">{service.title} courses</h2> : null}{available.length ? <CourseSchedulingPreview catalog={available} initialCourseId={params.courseId} persist initialRuns={availableRuns} dogs={dogs} trainingEntries={trainingEntries} today={new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })} /> : <p>No course templates for this service yet. Create one in Course Builder.</p>}</div>
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
