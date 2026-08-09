import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import {
  StoryboardCategory,
  StoryboardAttachment,
} from "@/src/domain/storyboard/types";
import { isSessionValid } from "@/src/app/api/storyboard/auth/route";

export const runtime = "nodejs";

const CATEGORIES: StoryboardCategory[] = [
  "thought",
  "suggestion",
  "idea",
  "random",
];

const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;
const MAX_ATTACHMENTS = 4;

function isAttachment(value: unknown): value is StoryboardAttachment {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.url === "string" &&
    a.url.startsWith("http") &&
    typeof a.name === "string" &&
    typeof a.type === "string"
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 1),
    100,
  );

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("storyboard")
      .select("id, name, category, message, attachment_urls, created_at, is_approved, is_pinned")
      .eq("is_approved", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      data: (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        message: row.message,
        attachmentUrls: (row.attachment_urls ?? [])
          .filter(isAttachment)
          .slice(0, MAX_ATTACHMENTS),
        createdAt: row.created_at,
        isApproved: row.is_approved,
        isPinned: row.is_pinned ?? false,
      })),
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { data: [], error: err.message },
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

  const category = body.category as StoryboardCategory;
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json(
      { data: null, error: `Category must be one of: ${CATEGORIES.join(", ")}` },
      { status: 400 },
    );
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json(
      { data: null, error: "Message is required" },
      { status: 400 },
    );
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { data: null, error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim().slice(0, MAX_NAME_LENGTH) || null;

  const attachmentUrls = Array.isArray(body.attachmentUrls)
    ? body.attachmentUrls.filter(isAttachment).slice(0, MAX_ATTACHMENTS)
    : [];

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("storyboard")
      .insert({
        name,
        category,
        message,
        attachment_urls: attachmentUrls,
        is_approved: true,
      })
      .select("id, name, category, message, attachment_urls, created_at, is_approved, is_pinned")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        data: {
          id: data.id,
          name: data.name,
          category: data.category,
          message: data.message,
          attachmentUrls: (data.attachment_urls ?? [])
            .filter(isAttachment)
            .slice(0, MAX_ATTACHMENTS),
          createdAt: data.created_at,
          isApproved: data.is_approved,
          isPinned: data.is_pinned ?? false,
        },
        error: null,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}

function isAuthorized(req: NextRequest): boolean {
  return isSessionValid(req);
}

// Admin-only: toggle the pinned state of a post. Requires a valid admin
// session (HttpOnly cookie set via POST /api/storyboard/auth).
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
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

  if (!body.id) {
    return NextResponse.json(
      { data: null, error: "Missing post id" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("storyboard")
      .update({ is_pinned: body.pinned === true })
      .eq("id", body.id)
      .select("id, name, category, message, attachment_urls, created_at, is_approved, is_pinned")
      .single();

    if (error) throw error;

    return NextResponse.json({
      data: {
        id: data.id,
        name: data.name,
        category: data.category,
        message: data.message,
        attachmentUrls: (data.attachment_urls ?? [])
          .filter(isAttachment)
          .slice(0, MAX_ATTACHMENTS),
        createdAt: data.created_at,
        isApproved: data.is_approved,
        isPinned: data.is_pinned ?? false,
      },
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}
