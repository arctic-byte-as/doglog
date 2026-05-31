import crypto from 'crypto';

export const passwordResetMinutes = 30;

export function createPasswordResetToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashPasswordResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('base64url');
}
