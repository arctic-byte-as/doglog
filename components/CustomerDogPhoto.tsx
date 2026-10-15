'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DogProfileImageField from './DogProfileImageField';
import type { ComponentProps } from 'react';
import { saveDogPhoto } from '@/lib/save-dog-photo';

export default function CustomerDogPhoto({ dog, locale, labels, success }: { dog: { id: string; profileImageUrl: string | null }; locale: 'en' | 'nb'; labels: ComponentProps<typeof DogProfileImageField>['labels']; success: string }) {
  const [value, setValue] = useState(dog.profileImageUrl || '');
  const router = useRouter();
  return <DogProfileImageField value={value} locale={locale} labels={labels} uploadSuccessMessage={success} onChange={async (url) => { await saveDogPhoto(dog.id, url); setValue(url); router.refresh(); }} />;
}
