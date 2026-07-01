import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "mia_admin_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me",
);

/** Create a signed session token after a successful password check. */
export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;

/**
 * Server-component / route-handler check. Reads the httpOnly cookie.
 * `next/headers` is imported lazily so this module stays edge-safe for use
 * inside middleware (which only needs verifyToken / SESSION_COOKIE).
 */
export async function isAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "mia-admin-2026";
  return password === expected;
}
