import { NextResponse } from 'next/server';
import { getCurrentUser } from './auth';
import { GoogleCalendarError, requireGoogleCalendarOrigin } from './google-calendar-config';
export async function googleCalendarTrainer(request: Request) {
  const user = await getCurrentUser();
  if (!user) throw new GoogleCalendarError('Please sign in again.', 401);
  if (!user.modes.includes('ADMIN') || !user.trainer) throw new GoogleCalendarError('Trainer access is required.', 403);
  requireGoogleCalendarOrigin(request);
  return { trainerId: user.trainer.id, userId: user.user.id };
}
export function googleCalendarApiError(error: unknown) {
  if (error instanceof GoogleCalendarError) return NextResponse.json({ error: error.message }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json({ error: 'The Google connection could not be updated. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
}
