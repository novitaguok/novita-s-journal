import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

const COOKIE_NAME = "storyboard_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getAuthSecret(): string {
  const secret = process.env.STORYBOARD_AUTH_SECRET;
  if (!secret) throw new Error("STORYBOARD_AUTH_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function verifySignature(payload: string, signature: string): boolean {
  const expected = sign(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

function setSessionCookie(res: NextResponse): void {
  const payload = `${Date.now()}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

function isSessionValid(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const dot = cookie.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = cookie.slice(0, dot);
  const signature = cookie.slice(dot + 1);
  if (!verifySignature(payload, signature)) return false;
  const issuedAt = parseInt(payload, 10);
  if (Number.isNaN(issuedAt)) return false;
  return Date.now() - issuedAt < SESSION_TTL_SECONDS * 1000;
}

// POST /api/storyboard/auth — log in with the admin password.
export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const expected = process.env.STORYBOARD_ADMIN_PASSWORD;
  if (!expected || typeof body.password !== "string" || !body.password) {
    return NextResponse.json(
      { data: null, error: "Password required" },
      { status: 400 },
    );
  }

  const a = Buffer.from(body.password);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    return NextResponse.json(
      { data: null, error: "Wrong password" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ data: { admin: true }, error: null });
  setSessionCookie(res);
  return res;
}

// DELETE /api/storyboard/auth — log out, clearing the session cookie.
export async function DELETE() {
  const res = NextResponse.json({ data: { admin: false }, error: null });
  clearSessionCookie(res);
  return res;
}

// GET /api/storyboard/auth — is the current session an admin?
export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: { admin: isSessionValid(req) },
    error: null,
  });
}

// Export for the PATCH route to share the session check.
export { isSessionValid };
