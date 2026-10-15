import Image from 'next/image';
import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function CustomerDogsPage() {
  const user = await requireCustomer();
  const t = getCustomerDictionary(await getCustomerLocale());
  const dogs = await prisma.dog.findMany({ where: { customerId: user.customer.id }, orderBy: { name: 'asc' }, select: { id: true, name: true, breed: true, age: true, profileImageUrl: true } });
  return <SiteShell><SectionCard title={t.dashboard.yourDogs}>
    {dogs.length ? <div className="grid gap-4 sm:grid-cols-2">{dogs.map((dog) => <article key={dog.id} className="rounded-2xl border border-brand-200 p-5"><div className="flex items-center gap-4">{dog.profileImageUrl ? <Image src={dog.profileImageUrl} alt={dog.name} width={64} height={64} unoptimized className="h-16 w-16 rounded-2xl object-cover" /> : <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-xl font-semibold">{dog.name.slice(0, 1)}</span>}<div><h3 className="font-semibold">{dog.name}</h3><p className="mt-1 text-sm">{dog.breed || t.dashboard.breedNotSet}{dog.age ? ` · ${dog.age}` : ''}</p></div></div><Link href={`/customer/profile#dog-${dog.id}`} className="mt-4 inline-flex items-center rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold">{t.nav.profile} →</Link></article>)}</div> : <p>{t.dashboard.noDogs}</p>}
    <Link href="/customer/profile#add-dog" className="inline-flex items-center rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white">{t.profile.addAnotherDog}</Link>
  </SectionCard></SiteShell>;
}
