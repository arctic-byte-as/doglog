import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { googleCalendarConfig, googleCalendarCookie } from '@/lib/google-calendar-config';
import { googleCalendarStateKey } from '@/lib/google-calendar-crypto';
import { consumeGoogleCalendarState, completeGoogleCalendar } from '@/lib/google-calendar-server';
export async function GET(request: NextRequest) {
  let config;
  try { config = googleCalendarConfig(); } catch { return new NextResponse('Google Calendar is not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
  let result = 'failed';
  try {
    const user = await getCurrentUser();
    if (!user?.modes.includes('ADMIN') || !user.trainer) result = 'sign-in';
    else {
      const params = request.nextUrl.searchParams;
      const state = params.get('state') || '', cookie = request.cookies.get(googleCalendarCookie)?.value || '';
      const pending = await consumeGoogleCalendarState(user.trainer.id, user.user.id, state, cookie);
      if (params.has('error')) {
        await prisma.appContent.deleteMany({ where: { key: googleCalendarStateKey(user.trainer.id), value: pending.receipt } });
        result = 'cancelled';
      } else {
        const code = params.get('code');
        if (!code || code.length > 4096) throw new Error('Invalid authorization response.');
        await completeGoogleCalendar(user.trainer.id, code, pending.verifier, pending.receipt);
        result = 'connected';
      }
    }
  } catch { /* Never send Google's raw errors, authorization codes or credentials to the browser/logs. */ }
  const response = NextResponse.redirect(new URL(`/services/consultations/google?result=${result}`, config.origin), 303);
  response.headers.set('Cache-Control', 'no-store'); response.headers.set('Referrer-Policy', 'no-referrer');
  response.cookies.set(googleCalendarCookie, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/integrations/google', maxAge: 0 });
  return response;
}
