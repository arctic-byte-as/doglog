import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
export const googleCalendarKey = (trainerId: string) => `google-calendar:${trainerId}`;
export const googleCalendarStateKey = (trainerId: string) => `google-calendar-state:${trainerId}`;
export const stateHash = (value: string) => createHash('sha256').update(value).digest('base64url');
export function sameState(value: string, expectedHash: string) {
  const actual = Buffer.from(stateHash(value)), expected = Buffer.from(expectedHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function sealGoogleValue(value: unknown, key: Buffer, context: string) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(context));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: encrypted.toString('base64') });
}
export function openGoogleValue<T>(value: string, key: Buffer, context: string): T {
  const stored = JSON.parse(value);
  if (stored.v !== 1) throw new Error('Invalid saved Google connection.');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(stored.iv, 'base64'));
  decipher.setAAD(Buffer.from(context)); decipher.setAuthTag(Buffer.from(stored.tag, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(stored.data, 'base64')), decipher.final()]).toString('utf8'));
}
