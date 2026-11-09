export const googleCalendarScope = 'https://www.googleapis.com/auth/calendar.events.owned';
export const googleCalendarCookie = 'norsepaw_google_calendar_state';
export class GoogleCalendarError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function googleCalendarConfig() {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const encodedKey = process.env.GOOGLE_CALENDAR_ENCRYPTION_KEY || '';
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || '';
  let redirect: URL;
  try { redirect = new URL(redirectUri); } catch { throw new GoogleCalendarError('Google Calendar is not configured in this environment.', 503); }
  if (process.env.GOOGLE_CALENDAR_ENABLED !== 'true' || !clientId?.endsWith('.apps.googleusercontent.com') || !clientSecret || Buffer.from(encodedKey, 'base64').length !== 32 || redirect.protocol !== 'https:' || redirect.username || redirect.password || redirect.search || redirect.hash || redirect.pathname !== '/api/integrations/google/callback') throw new GoogleCalendarError('Google Calendar is not configured in this environment.', 503);
  return { clientId, clientSecret, encryptionKey: Buffer.from(encodedKey, 'base64'), redirectUri, origin: redirect.origin };
}
export function googleCalendarReady() { try { googleCalendarConfig(); return true; } catch { return false; } }
export function requireGoogleCalendarOrigin(request: Request) {
  const config = googleCalendarConfig();
  if (request.headers.get('origin') !== config.origin || new URL(request.url).origin !== config.origin) throw new GoogleCalendarError('Open the Google Calendar connection from the configured Dev address and try again.', 403);
  return config;
}
