import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingStatsClient from '@/components/TrainingStatsClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function TrainingStatsPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const dogs = await prisma.dog.findMany({ where: { customerId: user.customer.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  const entries = await prisma.trainingEntry.findMany({ where: { dog: { customerId: user.customer.id } }, select: { dogId: true, day: true, exerciseName: true, minutes: true, completed: true } });
  return <SiteShell><SectionCard title={locale === 'nb' ? 'Treningsfremgang' : 'Training progress'} actions={<Link href="/customer/diary" className="underline">{locale === 'nb' ? 'Åpne dagboken' : 'Open training diary'}</Link>}><TrainingStatsClient dogs={dogs} entries={entries} locale={locale} today={new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })} /></SectionCard></SiteShell>;
}
