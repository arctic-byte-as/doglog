import Link from 'next/link';
import type { customerConsultationBookings } from '@/lib/consultation-bookings-server';
type Booking=Awaited<ReturnType<typeof customerConsultationBookings>>[number];
export default function CustomerConsultationBookings({bookings,locale='en'}:{bookings:Booking[];locale?:'en'|'nb'}){
  const nb=locale==='nb';
  if(!bookings.length)return null;
  return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">{nb?'Nettkonsultasjoner':'Online consultations'}</h2><Link href="/customer/appointments" className="text-sm font-semibold underline">{nb?'Se alle avtaler':'View all appointments'}</Link></div>{bookings.map(booking=><article key={booking.id} className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4"><h3 className="font-semibold">{booking.dogName} · {booking.topic}</h3><p className="text-sm">{booking.day} · {booking.startTime}–{booking.endTime} · Europe/Oslo</p>{booking.status==='cancelled'?<p className="text-sm">{nb?'Avlyst':'Cancelled'}</p>:booking.cancellationPending?<p className="text-sm">{nb?'Avlysning behandles':'Cancellation pending'}</p>:booking.meetUrl?<a className="inline-flex min-h-11 items-center rounded-full bg-brand-900 px-5 py-2 text-sm font-semibold text-white" href={booking.meetUrl} target="_blank" rel="noopener noreferrer">{nb?'Bli med i konsultasjonen':'Join consultation'} ↗</a>:<p className="text-sm">{nb?'Møtelenken klargjøres.':'Your meeting link is being prepared.'}</p>}</article>)}</section>;
}
