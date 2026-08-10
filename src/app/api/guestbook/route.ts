import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/src/lib/guestbook/session";
import { GuestbookUseCase } from "@/src/use-cases/guestbook/GuestbookUseCase";
import { SupabaseGuestbookRepository } from "@/src/infrastructure/guestbook/SupabaseGuestbookRepository";
import { errorMessage } from "@/src/lib/errors";

export const runtime = "nodejs";

function createUseCase(): GuestbookUseCase {
  return new GuestbookUseCase(new SupabaseGuestbookRepository());
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "50", 10) || 50;

  try {
    const posts = await createUseCase().listApproved(limit);
    return NextResponse.json({ data: posts, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: [], error: errorMessage(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    category?: string;
    message?: string;
    attachmentUrls?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  try {
    const post = await createUseCase().createPost(body);
    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: errorMessage(err) },
      { status: 400 },
    );
  }
}

// Admin-only: toggle the pinned state of a post. Requires a valid admin
// session (HttpOnly cookie set via POST /api/guestbook/auth).
export async function PATCH(req: NextRequest) {
  if (!isSessionValid(req)) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { id?: string; pinned?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  try {
    const post = await createUseCase().setPinned(body.id ?? "", body.pinned === true);
    return NextResponse.json({ data: post, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: errorMessage(err) },
      { status: 400 },
    );
  }
}
