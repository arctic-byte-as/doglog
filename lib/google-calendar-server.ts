import { randomBytes } from 'node:crypto';
import { OAuth2Client, CodeChallengeMethod } from 'google-auth-library';
import prisma from './prisma';
import { GoogleCalendarError, googleCalendarConfig, googleCalendarScope } from './google-calendar-config';
import { googleCalendarKey, googleCalendarStateKey, openGoogleValue, sameState, sealGoogleValue, stateHash } from './google-calendar-crypto';

type Connection = { clientId: string; subject: string; email: string; refreshToken: string; accessToken: string; expiresAt: number; connectedAt: string; checkedAt: string | null };
type Pending = { hash: string; verifier: string; expiresAt: number; userId: string; exchanging?: boolean };
const oauthClient = () => { const config = googleCalendarConfig(); return new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri); };

export async function googleCalendarStatus(trainerId: string) {
  const config = googleCalendarConfig(), key = googleCalendarKey(trainerId);
  const row = await prisma.appContent.findUnique({ where: { key } });
  if (!row) return { connected: false as const };
  try {
    const connection = openGoogleValue<Connection>(row.value, config.encryptionKey, key);
    if (connection.clientId !== config.clientId) return { connected: false as const, reconnect: true };
    return { connected: true as const, email: connection.email, connectedAt: connection.connectedAt, checkedAt: connection.checkedAt };
  } catch { return { connected: false as const, reconnect: true }; }
}
export async function beginGoogleCalendar(trainerId: string, userId: string) {
  const config = googleCalendarConfig(), client = oauthClient(), state = randomBytes(32).toString('base64url');
  const pkce = await client.generateCodeVerifierAsync();
  const key = googleCalendarStateKey(trainerId);
  const value = sealGoogleValue({ hash: stateHash(state), verifier: pkce.codeVerifier, userId, expiresAt: Date.now() + 10 * 60_000 } satisfies Pending, config.encryptionKey, key);
  await prisma.appContent.upsert({ where: { key }, create: { key, value }, update: { value } });
  const url = client.generateAuthUrl({ access_type: 'offline', prompt: 'consent select_account', scope: ['openid', 'email', googleCalendarScope], state, code_challenge: pkce.codeChallenge, code_challenge_method: CodeChallengeMethod.S256, include_granted_scopes: false });
  return { url, state };
}
export async function consumeGoogleCalendarState(trainerId: string, userId: string, state: string, cookie: string) {
  const config = googleCalendarConfig(), key = googleCalendarStateKey(trainerId);
  if (!/^[A-Za-z0-9_-]{43}$/.test(state) || !sameState(cookie, stateHash(state))) throw new GoogleCalendarError('The Google connection expired or could not be verified. Start again.');
  const row = await prisma.appContent.findUnique({ where: { key } });
  if (!row) throw new GoogleCalendarError('The Google connection expired or has already been used. Start again.');
  let pending: Pending;
  try { pending = openGoogleValue<Pending>(row.value, config.encryptionKey, key); } catch { throw new GoogleCalendarError('Start the Google connection again.'); }
  if (!sameState(state, pending.hash) || pending.userId !== userId || pending.expiresAt <= Date.now() || pending.exchanging) throw new GoogleCalendarError('The Google connection expired or could not be verified. Start again.');
  const receipt = sealGoogleValue({ ...pending, exchanging: true }, config.encryptionKey, key);
  const removed = await prisma.appContent.updateMany({ where: { key, value: row.value }, data: { value: receipt } });
  if (removed.count !== 1) throw new GoogleCalendarError('This Google connection request has already been used. Start again.');
  return { verifier: pending.verifier, receipt };
}
export async function completeGoogleCalendar(trainerId: string, code: string, verifier: string, receipt: string) {
  const config = googleCalendarConfig(), client = oauthClient();
  try {
    const { tokens } = await client.getToken({ code, codeVerifier: verifier });
    if (!tokens.access_token || !tokens.refresh_token || !tokens.id_token || !tokens.scope?.split(' ').includes(googleCalendarScope)) throw new GoogleCalendarError('Google did not grant the required calendar permission. Connect again and allow calendar access.');
    const identity = (await client.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId })).getPayload();
    if (!identity?.sub || !identity.email || !identity.email_verified) throw new GoogleCalendarError('Google could not verify the selected account.');
    const key = googleCalendarKey(trainerId);
    const connection: Connection = { clientId: config.clientId, subject: identity.sub, email: identity.email, refreshToken: tokens.refresh_token, accessToken: tokens.access_token, expiresAt: tokens.expiry_date || Date.now() + 3600_000, connectedAt: new Date().toISOString(), checkedAt: null };
    const value = sealGoogleValue(connection, config.encryptionKey, key);
    await prisma.$transaction(async tx => {
      const active = await tx.appContent.deleteMany({ where: { key: googleCalendarStateKey(trainerId), value: receipt } });
      if (!active.count) throw new GoogleCalendarError('The connection was cancelled or replaced. Please start again.', 409);
      await tx.appContent.upsert({ where: { key }, create: { key, value }, update: { value } });
    });
  } catch (error) {
    if (error instanceof GoogleCalendarError) throw error;
    throw new GoogleCalendarError('Google could not complete the connection. Check your test-user access and try again.', 502);
  }
}
export async function checkGoogleCalendar(trainerId: string) {
  const config = googleCalendarConfig(), key = googleCalendarKey(trainerId);
  const row = await prisma.appContent.findUnique({ where: { key } });
  if (!row) throw new GoogleCalendarError('Connect Google Calendar first.');
  try {
    const connection = openGoogleValue<Connection>(row.value, config.encryptionKey, key);
    if (connection.clientId !== config.clientId) throw new GoogleCalendarError('Reconnect Google Calendar to renew access.');
    const client = oauthClient();
    client.setCredentials({ refresh_token: connection.refreshToken, access_token: connection.accessToken, expiry_date: connection.expiresAt });
    // Request only the access role; no event titles, attendees or content are fetched.
    const result = await client.request<{ accessRole: string }>({ url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events', params: { maxResults: 1, fields: 'accessRole' } });
    if (result.data.accessRole !== 'owner') throw new GoogleCalendarError('Your selected account must own its primary calendar. Try connecting another account.');
    connection.accessToken = client.credentials.access_token || connection.accessToken;
    connection.refreshToken = client.credentials.refresh_token || connection.refreshToken;
    connection.expiresAt = client.credentials.expiry_date || connection.expiresAt;
    connection.checkedAt = new Date().toISOString();
    // Never recreate a connection that was disconnected or replaced during this check.
    const changed = await prisma.appContent.updateMany({ where: { key, value: row.value }, data: { value: sealGoogleValue(connection, config.encryptionKey, key) } });
    if (!changed.count) throw new GoogleCalendarError('The connection changed. Reload before checking again.', 409);
    return { checkedAt: connection.checkedAt };
  } catch (error) {
    if (error instanceof GoogleCalendarError) throw error;
    throw new GoogleCalendarError('Google Calendar could not be reached or access has expired. Try again, or reconnect Google.', 502);
  }
}
export async function disconnectGoogleCalendar(trainerId: string) {
  await prisma.appContent.deleteMany({ where: { key: { in: [googleCalendarKey(trainerId), googleCalendarStateKey(trainerId)] } } });
}
