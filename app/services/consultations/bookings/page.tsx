import Link from 'next/link';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { googleCalendarReady } from '@/lib/google-calendar-config';
import { googleCalendarStatus } from '@/lib/google-calendar-server';
import { trainerConsultationBookings } from '@/lib/consultation-bookings-server';
import ConsultationBookingsClient from '@/components/ConsultationBookingsClient';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
export default async function ConsultationBookingsPage(){
  const user=await requireTrainer();
  if(!googleCalendarReady())return <SiteShell><SectionCard title="Consultation bookings"><p>Online booking is not configured in this environment.</p></SectionCard></SiteShell>;
  const [dogs,bookings,status]=await Promise.all([prisma.dog.findMany({where:{trainerId:user.trainer.id,customerId:{not:null}},select:{id:true,name:true,customer:{select:{id:true,name:true,email:true}}},orderBy:{name:'asc'}}),trainerConsultationBookings(user.trainer.id),googleCalendarStatus(user.trainer.id)]);
  return <SiteShell><SectionCard title="Consultations"><ServicesLayout activeHref="/services/consultations"><div className="space-y-5"><Link href="/services/consultations" className="underline">← Back to consultations</Link><ConsultationBookingsClient dogs={dogs.flatMap(dog=>dog.customer?[{...dog,customer:dog.customer}]:[])} initialBookings={bookings} connected={status.connected} googleEmail={'email' in status?status.email:undefined} today={new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Oslo'})}/></div></ServicesLayout></SectionCard></SiteShell>;
}
