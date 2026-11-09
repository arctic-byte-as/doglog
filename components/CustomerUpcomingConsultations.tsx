import { customerConsultationBookings } from '@/lib/consultation-bookings-server';
import CustomerConsultationBookings from './CustomerConsultationBookings';
export default async function CustomerUpcomingConsultations({customerId,locale}:{customerId:string;locale:'en'|'nb'}){
  const today=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Oslo'});
  const bookings=(await customerConsultationBookings(customerId)).filter(item=>item.status==='confirmed' && item.day>=today).slice(0,3);
  return <CustomerConsultationBookings bookings={bookings} locale={locale}/>;
}
