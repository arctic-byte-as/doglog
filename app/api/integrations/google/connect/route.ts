import { NextResponse } from 'next/server';
import { googleCalendarTrainer, googleCalendarApiError } from '@/lib/google-calendar-api';
import { googleCalendarCookie } from '@/lib/google-calendar-config';
import { beginGoogleCalendar } from '@/lib/google-calendar-server';
export async function POST(request: Request) {
  try {
    const user = await googleCalendarTrainer(request);
    const { state, url } = await beginGoogleCalendar(user.trainerId, user.userId);
    const response = NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(googleCalendarCookie, state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/integrations/google', maxAge: 600 });
    return response;
  } catch (error) { return googleCalendarApiError(error); }
}
