import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import CustomerServiceAccessForm from '@/components/CustomerServiceAccessForm';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function TailoredTrainingPlanPage() {
  const user = await requireTrainer();
  const customers = await prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, include: { serviceAccess: true }, orderBy: { name: 'asc' } });
  return <SiteShell><SectionCard title="Services"><ServicesLayout activeHref="/services/tailored-training-plan"><div className="space-y-5">
    <h2 className="text-2xl font-semibold">Tailored Training Plan</h2>
    <p className="text-sm leading-6">Give customers an exercise calendar, daily scheduling with repetitions and duration, completion checkboxes, progress charts, and encouraging training summaries.</p>
    <p className="text-sm leading-6">Enable Tailored Training Plan for a customer below. They can open it from their home page under Services. Exercises come from the existing exercise bank.</p>
    <Link href="/admin/testing" className="inline-flex min-h-11 items-center rounded-full border border-brand-200 px-5 py-2 font-semibold">Try the customer preview</Link>
    {customers.map((customer) => <article key={customer.id} className="space-y-4 rounded-2xl border border-brand-200 p-5"><h3 className="font-semibold">{customer.name}</h3><CustomerServiceAccessForm customerId={customer.id} enabledServices={customer.serviceAccess.map((item) => item.serviceKey)} /></article>)}
    {!customers.length ? <p>No customers are linked to your dogs yet.</p> : null}
  </div></ServicesLayout></SectionCard></SiteShell>;
}
