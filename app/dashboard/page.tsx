import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import TrainerCalendar from '@/components/TrainerCalendar';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardCustomers from '@/components/DashboardCustomers';
import { customerServiceOptions } from '@/lib/service-options';

export default async function DashboardPage({ searchParams }: { searchParams?: { palette?: string } }) {
  const user = await requireTrainer();

  const [dogCount, customers, consultationCount, activeCourseParticipants, activeCourseGroups] = await Promise.all([
    prisma.dog.count({
      where: { trainerId: user.trainer.id },
    }),
    prisma.customer.findMany({
      where: { dogs: { some: { trainerId: user.trainer.id } } },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: {
        id: true, name: true, email: true, phone: true,
        dogs: { where: { trainerId: user.trainer.id }, orderBy: { name: 'asc' }, select: { id: true, name: true, breed: true, profileImageUrl: true } },
        serviceAccess: { select: { serviceKey: true } },
      },
    }),
    prisma.consultation.count({
      where: { dog: { trainerId: user.trainer.id } },
    }),
    prisma.customer.count({
      where: {
        dogs: { some: { trainerId: user.trainer.id } },
        serviceAccess: {
          some: {
            serviceKey: {
              in: ['PUPPY_COURSE', 'SKILLS_COURSE'],
            },
          },
        },
      },
    }),
    prisma.customerServiceAccess.groupBy({
      by: ['serviceKey'],
      where: {
        customer: { dogs: { some: { trainerId: user.trainer.id } } },
        serviceKey: {
          in: ['PUPPY_COURSE', 'SKILLS_COURSE'],
        },
      },
    }),
  ]);
  const activeCourseCount = activeCourseGroups.length;

  const summary = [
    { label: 'Dogs', value: dogCount, href: '/dogs' },
    { label: 'Customers', value: customers.length, href: '#dashboard-customers' },
    { label: 'Active consultations', value: consultationCount, href: '/consultations' },
    { label: 'Active course participants', value: activeCourseParticipants, href: '/services/courses' },
    { label: 'Active courses', value: activeCourseCount, href: '/services/courses' },
    { label: 'Appointments', value: 0, href: '/appointments' },
  ];

  return (
    <SiteShell>
      <div className="space-y-8">
        <DashboardCustomers contrastPreview={searchParams?.palette === 'contrast'} customers={customers.map((customer) => ({
          id: customer.id, name: customer.name, email: customer.email, phone: customer.phone,
          dogs: customer.dogs,
          serviceKeys: customer.serviceAccess.map((access) => access.serviceKey),
          services: customer.serviceAccess.map((access) => customerServiceOptions.find((service) => service.key === access.serviceKey)?.title || access.serviceKey),
        }))} />

        <details className="rounded-2xl border border-brand-200 bg-white p-4 sm:p-6">
          <summary className="cursor-pointer text-lg font-semibold text-brand-950">Overview &amp; calendar</summary>
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-6">
              {summary.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="grid min-h-36 grid-rows-[3rem_1fr] rounded-2xl bg-white p-5 text-brand-950 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-3xl sm:p-6"
                >
                  <p className="self-start text-xs font-semibold uppercase leading-5 text-brand-600 sm:text-sm">{item.label}</p>
                  <p className="self-end text-3xl font-semibold leading-none sm:text-4xl">{item.value}</p>
                </Link>
              ))}
            </div>

            <TrainerCalendar />
          </div>
        </details>
      </div>
    </SiteShell>
  );
}
