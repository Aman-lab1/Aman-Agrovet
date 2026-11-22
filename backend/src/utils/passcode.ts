import crypto from 'node:crypto';

const SCRYPT_KEYLEN = 64;

export function hashPasscode(passcode: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(passcode, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPasscode(passcode: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;

  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  const expectedBuffer = Buffer.from(expectedHex, 'hex');
  const actualBuffer = crypto.scryptSync(passcode, salt, SCRYPT_KEYLEN);

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
