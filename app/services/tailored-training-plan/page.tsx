import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import CustomerServiceAccessForm from '@/components/CustomerServiceAccessForm';
import TrainingDiaryClient from '@/components/TrainingDiaryClient';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function TailoredTrainingPlanPage({ searchParams }: { searchParams: Promise<{ customerId?: string }> }) {
  const user = await requireTrainer();
  const params = await searchParams;
  const customers = await prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, include: { serviceAccess: true }, orderBy: { name: 'asc' } });
  const customer = customers.find((item) => item.id === params.customerId) || customers[0];
  const dogs = customer ? await prisma.dog.findMany({ where: { customerId: customer.id, trainerId: user.trainer.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } }) : [];
  const entries = customer ? await prisma.trainingEntry.findMany({ where: { dog: { customerId: customer.id, trainerId: user.trainer.id } }, orderBy: [{ day: 'desc' }, { createdAt: 'desc' }] }) : [];
  return <SiteShell><SectionCard title="Tailored Training Plan admin"><ServicesLayout activeHref="/services/tailored-training-plan"><div className="space-y-5">
    <h1 className="text-2xl font-semibold">Manage tailored training plans</h1>
    <p className="text-sm leading-6">Choose a customer to schedule exercises, review their calendar, and follow their training progress. Saved changes appear in their training diary.</p>
    {customer ? <>
      <form action="/services/tailored-training-plan" method="get" className="flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-sm font-semibold">Customer<select name="customerId" defaultValue={customer.id} className="mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2">{customers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button className="min-h-11 rounded-full bg-brand-900 px-5 py-2 text-sm font-semibold text-white">Open plan</button></form>
      <div className="rounded-xl border border-brand-200 p-4"><CustomerServiceAccessForm key={customer.id} customerId={customer.id} enabledServices={customer.serviceAccess.map((item) => item.serviceKey)} onlyService="TAILORED_TRAINING_PLAN" /><p className="mt-2 text-xs text-brand-700">Enable this service to show the plan on the customer’s home page.</p></div>
      {dogs.length ? <TrainingDiaryClient key={customer.id} dogs={dogs} entries={entries.map(({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }) => ({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }))} locale="en" apiBase="/api/trainer/diary" /> : <p>No linked dogs found.</p>}
    </> : <p>No customers are linked to your dogs yet.</p>}
  </div></ServicesLayout></SectionCard></SiteShell>;
}
