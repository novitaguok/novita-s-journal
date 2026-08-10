import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  isSessionValid,
  setSessionCookie,
  clearSessionCookie,
} from "@/src/lib/guestbook/session";

export const runtime = "nodejs";

// POST /api/guestbook/auth — log in with the admin password.
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

  const expected = process.env.GUESTBOOK_ADMIN_PASSWORD;
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

// DELETE /api/guestbook/auth — log out, clearing the session cookie.
export async function DELETE() {
  const res = NextResponse.json({ data: { admin: false }, error: null });
  clearSessionCookie(res);
  return res;
}

// GET /api/guestbook/auth — is the current session an admin?
export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: { admin: isSessionValid(req) },
    error: null,
  });
}
