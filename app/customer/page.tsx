import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerCalendar from '@/components/CustomerCalendar';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';
import { customerServiceOptions } from '@/lib/service-options';
import { getCourses } from '@/lib/courses';

export default async function CustomerPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { id: user.customer.id },
    select: {
      name: true,
      serviceAccess: { select: { serviceKey: true } },
      dogs: { select: {
        name: true,
        consultations: { select: { id: true, date: true, focus: true } },
        serviceSessions: { where: { serviceKey: { in: ['PRIVATE_TRAINING', 'OPEN_TRAINING'] } }, select: { id: true, date: true, focus: true, serviceKey: true } },
      } },
    },
  });
  const enabled = new Set(customer.serviceAccess.map((access) => access.serviceKey));
  const services = customerServiceOptions.filter((service) => enabled.has(service.key));
  const courses = getCourses(locale);
  const dayKey = (date: Date) => date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const events = customer.dogs.flatMap((dog) => [
    ...(enabled.has('CONSULTATIONS') ? dog.consultations.map((record) => ({
      id: `consultation-${record.id}`, day: dayKey(record.date), dogName: dog.name,
      title: record.focus || t.services.CONSULTATIONS.title, href: `/customer/consultations/${record.id}`,
    })) : []),
    ...dog.serviceSessions.filter((record) => enabled.has(record.serviceKey)).map((record) => ({
      id: `session-${record.id}`, day: dayKey(record.date), dogName: dog.name,
      title: record.focus || (record.serviceKey === 'PRIVATE_TRAINING' ? t.services.PRIVATE_TRAINING.title : t.services.OPEN_TRAINING.title),
      href: `${record.serviceKey === 'PRIVATE_TRAINING' ? '/customer/services/private-training' : '/customer/services/open-training'}#session-${record.id}`,
    })),
  ]).sort((a, b) => a.day.localeCompare(b.day) || a.id.localeCompare(b.id));

  return (
    <SiteShell>
      <div className="customer-home dashboard-colour-preview space-y-8">
        <div className="dashboard-intro"><h1 className="text-2xl font-semibold sm:text-3xl">{t.dashboard.welcome}</h1><p className="dashboard-intro-copy mt-2 text-sm leading-6">{t.dashboard.welcomeHelp}</p></div>
        <SectionCard title={t.dashboard.assignedServices}>
          {services.length ? <div className="grid gap-4 lg:grid-cols-2">
            {services.map((service) => {
              const course = courses.find((item) => item.id === (service.key === 'PUPPY_COURSE' ? 'puppy' : service.key === 'SKILLS_COURSE' ? 'skills' : ''));
              return <article key={service.key} className="customer-course-card flex min-w-0 flex-col rounded-2xl border border-brand-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-semibold">{t.services[service.key].title}</h3>{course ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold">{course.weeks.length} {t.dashboard.weeks}</span> : null}</div>
                <p className="mt-3 text-sm leading-6">{course?.summary || t.services[service.key].description}</p>
                {course ? <>
                  <h4 className="mt-4 text-sm font-semibold">{t.dashboard.courseContent}</h4>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-2">{course.weeks.map((week) => <li key={week.title} className="rounded-xl bg-brand-50 p-3 text-sm"><span className="block text-xs font-semibold text-brand-600">{week.title}</span><span className="mt-1 block">{week.focus}</span></li>)}</ol>
                  <details className="mt-4 rounded-xl border border-brand-200 p-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">{t.dashboard.preview} <span aria-hidden="true">＋</span></summary><p className="mt-2 text-sm leading-6">{course.weeks[0]?.details}</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{course.weeks[0]?.activities?.map((activity) => <li key={activity}>{activity}</li>)}</ul></details>
                </> : null}
                <Link href={service.href} className="customer-course-action mt-5 inline-flex min-h-11 items-center justify-center self-start rounded-full px-5 py-3 text-sm font-semibold">{course ? t.dashboard.openCourse : t.services.viewService}<span aria-hidden="true" className="ml-3">→</span></Link>
              </article>;
            })}
          </div> : <p className="text-sm leading-6">{t.services.noAssigned}</p>}
        </SectionCard>
        <CustomerCalendar events={events} today={dayKey(new Date())} locale={locale} labels={t.dashboard} />
      </div>
    </SiteShell>
  );
}
