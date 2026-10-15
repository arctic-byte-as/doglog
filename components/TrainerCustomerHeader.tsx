'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SubjectHeader from './SubjectHeader';

type Dog = { id: string; name: string; profileImageUrl: string | null };

export default function TrainerCustomerHeader({ customer, dogs }: {
  customer: { id: string; name: string; email: string; phone: string | null };
  dogs: Dog[];
}) {
  const dog = dogs.find((item) => item.profileImageUrl) || dogs[0];
  const [failed, setFailed] = useState<string | null>(null);
  const source = dog?.profileImageUrl;
  const href = dog ? `/dogs?customer=${encodeURIComponent(customer.id)}&editDog=${encodeURIComponent(dog.id)}#dog-${dog.id}` : '/dogs';
  return <section className="trainer-customer-header grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.65fr)]">
    <SubjectHeader><div className="flex h-full min-w-0 flex-col justify-center text-white">
      <p className="text-sm font-semibold">Customer</p>
      <h1 className="mt-2 break-words text-2xl font-semibold">{customer.name}</h1>
      <p className="mt-3 break-all text-sm">{customer.email}</p>
      {customer.phone ? <p className="mt-2 text-sm">{customer.phone}</p> : null}
      <Link href="/dogs" className="mt-4 inline-block self-start text-sm font-semibold underline underline-offset-4">View all dog profiles</Link>
    </div></SubjectHeader>
    <a href={href} aria-label={dog ? `Change photo for ${dog.name}` : 'View dog profiles'} className="trainer-customer-photo relative block min-h-56 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm md:min-h-64">
      {source && source !== failed ? <Image src={source} alt={dog.name} fill unoptimized sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" onError={() => setFailed(source)} /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-100 p-6 text-center"><span aria-hidden="true" className="text-3xl font-semibold">{dog?.name.slice(0, 1).toUpperCase() || '+'}</span><span className="text-sm font-semibold">Add a dog photo</span></div>}
      <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-brand-950"><span className="truncate">{dog?.name || 'Dog profiles'}</span><span>Change photo →</span></span>
    </a>
  </section>;
}
