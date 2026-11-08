import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getCustomCourseTemplates, getTrainerCourseCatalog } from '@/lib/course-template-server';
import CourseBuilderClient from '@/components/CourseBuilderClient';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
export default async function CourseBuilderPage() {
  const user=await requireTrainer();
  const [stored,catalog,used]=await Promise.all([getCustomCourseTemplates(user.trainer.id),getTrainerCourseCatalog(user.trainer.id),prisma.courseRun.findMany({where:{trainerId:user.trainer.id},select:{courseId:true},distinct:['courseId']})]);
  return <SiteShell><SectionCard title="Course Builder"><ServicesLayout activeHref="/course-builder"><CourseBuilderClient initialTemplates={stored.templates} builtins={catalog.filter(course=>!course.id.startsWith('custom-'))} initialUpdatedAt={stored.updatedAt} usedIds={used.map(run=>run.courseId)}/></ServicesLayout></SectionCard></SiteShell>;
}
