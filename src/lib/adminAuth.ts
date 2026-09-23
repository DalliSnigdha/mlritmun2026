/* Shared-password admin auth for the accommodation tool — one login for the
 * whole organizing team, not individual accounts. A signed, expiring cookie
 * proves a browser already passed the password check; the signature uses
 * ADMIN_SESSION_SECRET so no one can forge one without it. */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "mlritmun_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sessionSecret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set — see .env.local.example for the accommodation admin setup.",
    );
  }
  return value;
}

/** Fixed-length digest compare — avoids leaking either string's length
 *  through a variable-length timingSafeEqual call. */
function secureStringsEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!secureStringsEqual(signature, sign(expiresAt))) return false;
  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return secureStringsEqual(password, expected);
}

export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
