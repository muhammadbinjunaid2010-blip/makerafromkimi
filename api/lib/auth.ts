import * as crypto from "node:crypto";

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2 with a random salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${key.toString("hex")}`;
}

/**
 * Verify a password against a hash created by hashPassword.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const [salt, key] = hashedPassword.split(":");
  if (!salt || !key) return false;
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  );
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
}

/**
 * Generate a cryptographically secure random token for email verification or password reset.
 */
export function generateToken(length = 48): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Generate a verification token with expiry.
 */
export function generateVerificationToken(): {
  token: string;
  expiresAt: Date;
} {
  return {
    token: generateToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
}

/**
 * Generate a password reset token with expiry.
 */
export function generateResetToken(): {
  token: string;
  expiresAt: Date;
} {
  return {
    token: generateToken(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
}
