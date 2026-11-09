import Link from 'next/link';
import { requireTrainer } from '@/lib/auth';
import { googleCalendarReady } from '@/lib/google-calendar-config';
import { googleCalendarStatus } from '@/lib/google-calendar-server';
import GoogleCalendarConnection from '@/components/GoogleCalendarConnection';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
export default async function GoogleCalendarPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const user = await requireTrainer(), configured = googleCalendarReady();
  const status = configured ? await googleCalendarStatus(user.trainer.id) : { connected: false };
  const { result } = await searchParams;
  return <SiteShell><SectionCard title="Consultations"><ServicesLayout activeHref="/services/consultations"><div className="space-y-5"><Link href="/services/consultations" className="underline">← Back to consultations</Link><GoogleCalendarConnection configured={configured} status={status} result={result}/></div></ServicesLayout></SectionCard></SiteShell>;
}
