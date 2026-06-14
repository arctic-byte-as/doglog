import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CoursesClient from '@/components/CoursesClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import { customerServiceOptions } from '@/lib/service-options';
import prisma from '@/lib/prisma';

function slugFor(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function CustomerServicePage({ params }: { params: { service: string } }) {
  const user = await requireCustomer();
  const locale = getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const service = customerServiceOptions.find((option) => slugFor(option.title) === params.service);
  if (!service) notFound();
  const serviceTitle = t.services[service.key]?.title || service.title;

  const access = await prisma.customerServiceAccess.findUnique({
    where: {
      customerId_serviceKey: {
        customerId: user.customer.id,
        serviceKey: service.key,
      },
    },
  });

  if (!access) notFound();

  const courseId = service.key === 'PUPPY_COURSE' ? 'puppy' : service.key === 'SKILLS_COURSE' ? 'skills' : null;
  const courseAccess = courseId
    ? await prisma.customerServiceAccess.findMany({
        where: {
          customerId: user.customer.id,
          serviceKey: { in: ['PUPPY_COURSE', 'SKILLS_COURSE'] },
        },
        select: { serviceKey: true },
      })
    : [];
  const availableCourseIds = courseAccess
    .map((item) => (item.serviceKey === 'PUPPY_COURSE' ? 'puppy' : item.serviceKey === 'SKILLS_COURSE' ? 'skills' : null))
    .filter((item): item is 'puppy' | 'skills' => Boolean(item));
  const sectionTitle = courseId && availableCourseIds.length > 1 ? (locale === 'nb' ? 'Dine kurs' : 'Your courses') : serviceTitle;
  const consultations =
    service.key === 'CONSULTATIONS'
      ? await prisma.consultation.findMany({
          where: {
            dog: {
              customerId: user.customer.id,
            },
          },
          include: {
            dog: true,
          },
          orderBy: {
            date: 'desc',
          },
        })
      : [];
  const serviceSessions =
    service.key === 'PRIVATE_TRAINING' || service.key === 'OPEN_TRAINING'
      ? await prisma.serviceSession.findMany({
          where: {
            serviceKey: service.key,
            dog: {
              customerId: user.customer.id,
            },
          },
          include: {
            dog: true,
          },
          orderBy: {
            date: 'desc',
          },
        })
      : [];

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title={sectionTitle}>
          {courseId ? (
            <CoursesClient
              editable={false}
              initialCourseId={courseId}
              lockedCourse
              locale={locale}
              availableCourseIds={availableCourseIds}
            />
          ) : service.key === 'CONSULTATIONS' ? (
            consultations.length ? (
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <Link
                    key={consultation.id}
                    href={`/customer/consultations/${consultation.id}`}
                    className="block rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
                  >
                    <p className="text-sm text-brand-700">
                      {consultation.dog.name} · {formatDate(consultation.date)}
                    </p>
                    <h3 className="mt-1 font-semibold text-brand-950">{consultation.focus || t.consultation.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-brand-700">
                      {consultation.outcome || t.consultation.noOutcome}
                    </p>
                    {consultation.generalDescription ? (
                      <p className="mt-2 text-sm leading-6 text-brand-700">{consultation.generalDescription}</p>
                    ) : null}
                    <p className="mt-3 text-sm font-medium text-brand-800">{t.consultation.viewFull}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
                {t.consultation.notesEmpty}
              </p>
            )
          ) : service.key === 'PRIVATE_TRAINING' || service.key === 'OPEN_TRAINING' ? (
            serviceSessions.length ? (
              <div className="space-y-4">
                {serviceSessions.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-brand-700">
                      {session.dog.name} · {formatDate(session.date)}
                    </p>
                    <h3 className="mt-1 font-semibold text-brand-950">{session.focus || serviceTitle}</h3>
                    {session.outcome ? <p className="mt-2 text-sm leading-6 text-brand-700">{session.outcome}</p> : null}
                    {session.generalDescription ? (
                      <p className="mt-2 text-sm leading-6 text-brand-700">{session.generalDescription}</p>
                    ) : null}
                    {session.prescribedPlan ? (
                      <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                        <p className="text-sm font-semibold text-brand-950">{t.sessions.followUpGuidance}</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-700">{session.prescribedPlan}</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-brand-700">{t.sessions.noFollowUp}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
                {serviceTitle} {t.sessions.notesWillAppear}
              </p>
            )
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
              {serviceTitle} {t.services.detailsAvailable}
            </p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
