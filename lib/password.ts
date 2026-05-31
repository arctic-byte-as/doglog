import crypto from 'crypto';

const keyLength = 64;
const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.scryptSync(password, salt, keyLength, scryptOptions).toString('base64url');

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;

  const [scheme, salt, hash] = storedHash.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const candidate = crypto.scryptSync(password, salt, keyLength, scryptOptions);
  const expected = Buffer.from(hash, 'base64url');

  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}
