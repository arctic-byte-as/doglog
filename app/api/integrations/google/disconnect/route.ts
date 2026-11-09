import { NextResponse } from 'next/server';
import { googleCalendarTrainer, googleCalendarApiError } from '@/lib/google-calendar-api';
import { googleCalendarCookie } from '@/lib/google-calendar-config';
import { disconnectGoogleCalendar } from '@/lib/google-calendar-server';
export async function POST(request: Request) {
  try {
    const user = await googleCalendarTrainer(request); await disconnectGoogleCalendar(user.trainerId);
    const response = NextResponse.json({ disconnected: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(googleCalendarCookie, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/integrations/google', maxAge: 0 }); return response;
  } catch (error) { return googleCalendarApiError(error); }
}
