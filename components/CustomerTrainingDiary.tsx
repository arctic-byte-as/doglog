import { getCustomerCourseEvents } from '@/lib/course-runs-server';
import TrainingDiaryClient from '@/components/TrainingDiaryClient';
import prisma from '@/lib/prisma';

export default async function CustomerTrainingDiary({ customerId, dogs, locale }: { customerId: string; dogs: { id: string; name: string }[]; locale: 'en' | 'nb' }) {
  const [courseEvents, entries] = await Promise.all([getCustomerCourseEvents(customerId, locale), prisma.trainingEntry.findMany({
    where: { dog: { customerId } },
    select: { id: true, dogId: true, day: true, exerciseName: true, category: true, minutes: true, repetitions: true, result: true, completed: true },
    orderBy: [{ day: 'desc' }, { createdAt: 'desc' }],
  })]);
  return <TrainingDiaryClient courseEvents={courseEvents} dogs={dogs} entries={entries} locale={locale} />;
}
