import Link from 'next/link';
import { requireCustomer } from '@/lib/auth';
import { getCustomerLocale } from '@/lib/i18n/customer';
import { customerConsultationBookings } from '@/lib/consultation-bookings-server';
import CustomerConsultationBookings from '@/components/CustomerConsultationBookings';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
export default async function CustomerAppointmentsPage(){const user=await requireCustomer(),locale=await getCustomerLocale(),bookings=await customerConsultationBookings(user.customer.id);return <SiteShell><SectionCard title={locale==='nb'?'Konsultasjonsavtaler':'Consultation appointments'}><div className="space-y-5"><Link href="/customer" className="underline">← {locale==='nb'?'Hjem':'Home'}</Link>{bookings.length?<CustomerConsultationBookings bookings={bookings} locale={locale}/>:<p>{locale==='nb'?'Ingen konsultasjonsavtaler ennå.':'No consultation appointments yet.'}</p>}</div></SectionCard></SiteShell>;}
