'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getDemoDogPhoto } from '@/lib/demo-dog-photos';

type PhotoDog = { id: string; name: string; breed: string; profileImageUrl: string | null };

export default function CustomerCardPhoto({ dogs }: { dogs: PhotoDog[] }) {
  const dog = dogs.find((item) => item.profileImageUrl) || dogs.find((item) => getDemoDogPhoto(item.id));
  const source = dog?.profileImageUrl || (dog ? getDemoDogPhoto(dog.id) : null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!dog || !source || failedSource === source) return <div className="customer-photo relative mb-5 flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-100 p-4 text-brand-800"><span aria-hidden="true" className="text-3xl font-semibold">{(dog || dogs[0])?.name.slice(0, 1).toUpperCase() || '+'}</span><span className="text-sm font-semibold">Add a dog photo</span><span className="text-center text-xs">Open the dog profile and choose Edit</span></div>;
  const demo = !dog.profileImageUrl;

  return (
    <div className="customer-photo relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl bg-brand-100">
      <Image src={source} alt={`${demo ? 'Illustrative demo photo of ' : ''}${dog.name}${dog.breed ? `, ${dog.breed}` : ''}`} fill sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 270px" unoptimized={!source.startsWith('/')} className={`object-cover ${demo ? 'object-center' : 'object-top'}`} onError={() => setFailedSource(source)} />
      <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-950">{demo ? 'Demo photo · ' : ''}{dog.name}</span>
    </div>
  );
}
