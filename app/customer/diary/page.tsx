import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingDiaryClient from '@/components/TrainingDiaryClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function TrainingDiaryPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const dogs = await prisma.dog.findMany({ where: { customerId: user.customer.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  const entries = await prisma.trainingEntry.findMany({ where: { dog: { customerId: user.customer.id } }, orderBy: [{ day: 'desc' }, { createdAt: 'desc' }] });
  return <SiteShell><SectionCard title={locale === 'nb' ? 'Treningsdagbok' : 'Training diary'}>
    {dogs.length ? <TrainingDiaryClient dogs={dogs} entries={entries.map(({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }) => ({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }))} locale={locale} /> : <Link href="/customer/dogs" className="underline">{locale === 'nb' ? 'Legg til en hund for å starte dagboken.' : 'Add a dog to start your training diary.'}</Link>}
  </SectionCard></SiteShell>;
}
