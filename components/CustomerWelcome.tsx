'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Dog = { id: string; name: string; profileImageUrl: string | null };

export default function CustomerWelcome({ name, dogs, title, description, locale }: { name: string; dogs: Dog[]; title: string; description: string; locale: 'en' | 'nb' }) {
  const dog = dogs.find((item) => item.profileImageUrl) || dogs[0];
  const [failed, setFailed] = useState<string | null>(null);
  const source = dog?.profileImageUrl;
  const showPhoto = source && source !== failed;
  const addPhoto = locale === 'nb' ? 'Legg til et bilde av hunden din' : 'Add a photo of your dog';
  const viewDogs = locale === 'nb' ? 'Hundene dine' : 'Your dogs';
  return <div className="customer-welcome grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.65fr)]">
    <div className="dashboard-intro flex min-w-0 flex-col justify-center">
      <p className="dashboard-intro-copy mb-3 break-words text-sm font-semibold">{name}</p>
      <h1 className="break-words text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="dashboard-intro-copy mt-3 text-sm leading-6">{description}</p>
    </div>
    <Link href="/customer/dogs" aria-label={`${viewDogs}${dog ? ` · ${dog.name}` : ''}`} className="customer-welcome-photo relative block min-h-56 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm md:min-h-64">
      {showPhoto ? <Image src={source} alt={dog.name} fill unoptimized sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" onError={() => setFailed(source)} /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-100 p-6 text-center"><span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-brand-950">{dog?.name.slice(0, 1) || '+'}</span><span className="text-sm font-semibold">{addPhoto}</span></div>}
      <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-brand-950"><span className="truncate">{dog?.name || viewDogs}</span><span aria-hidden="true">→</span></span>
    </Link>
  </div>;
}
