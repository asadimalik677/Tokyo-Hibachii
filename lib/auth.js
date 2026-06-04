import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "tokyo_admin_session";

function secret() {
  return process.env.SESSION_SECRET || "change-this-long-random-secret";
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw || !raw.includes(".")) return false;
  const [value, signature] = raw.split(".");
  const expected = sign(value);
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function setAdminSession() {
  const value = `admin:${Date.now()}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function validateCredentials(username, password) {
  return (
    username === (process.env.ADMIN_USERNAME || "admin") &&
    password === (process.env.ADMIN_PASSWORD || "anaPZyJN135vll")
  );
}
