import { NextResponse } from 'next/server';
import { googleCalendarTrainer, googleCalendarApiError } from '@/lib/google-calendar-api';
import { checkGoogleCalendar } from '@/lib/google-calendar-server';
export async function POST(request: Request) {
  try { const user = await googleCalendarTrainer(request); return NextResponse.json(await checkGoogleCalendar(user.trainerId), { headers: { 'Cache-Control': 'no-store' } }); }
  catch (error) { return googleCalendarApiError(error); }
}
