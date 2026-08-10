import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "guestbook_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getAuthSecret(): string {
  const secret = process.env.GUESTBOOK_AUTH_SECRET;
  if (!secret) throw new Error("GUESTBOOK_AUTH_SECRET is not set");
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

export function setSessionCookie(res: NextResponse): void {
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

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isSessionValid(req: NextRequest): boolean {
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
