export type BookingTimes = { day: string; startTime: string; endTime: string; startsAt: string; endsAt: string; topic: string };
export type BookingOperation = 'create' | 'update' | 'cancel' | 'invite' | 'refresh';
export type ConsultationBooking = BookingTimes & {
  id: string; trainerId: string; customerId: string; dogId: string; dogName: string; ownerName: string; attendeeEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled'; googleEventId: string; googleSubject: string; googleEmail: string;
  meetUrl: string | null; meetState: 'pending' | 'ready' | 'failed'; invitationSent: boolean; notifyOwner: boolean;
  operation: BookingOperation | null; operationId: string; changes?: BookingTimes; inviteEmail?: string;
  lease?: string; leaseUntil?: number; error?: string; updatedAt?: string;
};
export const bookingPrefix = (trainerId: string) => `consultation-booking:${trainerId}:`;
export const bookingKey = (trainerId: string, id: string) => `${bookingPrefix(trainerId)}${id}`;
export function validBookingId(value: unknown): value is string { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); }
const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23' });
function wallClock(value: number) { const parts = Object.fromEntries(formatter.formatToParts(new Date(value)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value])); return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00`; }
export function osloInstant(day: string, time: string): string | null {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const local = `${day}T${time}:00`, naive = Date.parse(`${local}Z`);
  if (!Number.isFinite(naive) || new Date(naive).toISOString().slice(0,10) !== day) return null;
  const offsets = new Set([-36,0,36].map(hours=>{const sample=naive+hours*3600_000;return Date.parse(`${wallClock(sample)}Z`)-sample;}));
  const matches = [...offsets].map(offset=>naive-offset).filter(candidate=>wallClock(candidate)===local);
  return matches.length === 1 ? new Date(matches[0]).toISOString() : null;
}
export function parseBookingTimes(value: unknown, now = Date.now()): BookingTimes | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (['day','startTime','endTime','topic'].some(key=>typeof v[key] !== 'string') || !(v.topic as string).trim() || (v.topic as string).length > 200) return null;
  const day = v.day as string, startTime=v.startTime as string, endTime=v.endTime as string;
  const startsAt=osloInstant(day,startTime), endsAt=osloInstant(day,endTime);
  if (!startsAt || !endsAt) return null;
  const minutes=(Date.parse(endsAt)-Date.parse(startsAt))/60_000;
  if (Date.parse(startsAt)<=now || minutes<15 || minutes>240) return null;
  return {day,startTime,endTime,startsAt,endsAt,topic:(v.topic as string).trim()};
}
export function bookingOverlap(a: BookingTimes, b: BookingTimes) { return a.startsAt < b.endsAt && b.startsAt < a.endsAt; }
export function safeMeetUrl(value: unknown) {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value); return url.origin === 'https://meet.google.com' && /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname) && !url.search && !url.hash && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validInviteEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/\.(test|invalid|example|localhost)$/i.test(value) && value.length<=254; }
export function publicBooking(booking: ConsultationBooking) {
  const { lease, leaseUntil, googleSubject, googleEventId, ...visible } = booking;
  return {...visible,meetUrl:safeMeetUrl(visible.meetUrl)};
}
