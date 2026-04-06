import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt sensitive data (e.g., account numbers).
 * Returns a base64-encoded string containing IV + auth tag + ciphertext.
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypt data that was encrypted with `encrypt()`.
 */
export function decrypt(encryptedBase64: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedBase64, 'base64');

  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Mask a string showing only the last N characters.
 * e.g., maskString("1234567890", 4) => "******7890"
 */
export function maskString(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return value;
  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}

/**
 * Mask email: show first 2 chars + domain.
 * e.g., "hello@example.com" => "he***@example.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

/**
 * Mask phone number: show last 4 digits.
 * e.g., "010-1234-5678" => "010-****-5678"
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return maskString(digits, 4);
}

/**
 * Generate a cryptographically secure random token.
 * Returns a URL-safe base64 string.
 */
export function generateToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString('base64url');
}
