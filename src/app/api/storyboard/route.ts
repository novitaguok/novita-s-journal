import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { StoryboardCategory } from "@/src/domain/storyboard/types";

export const runtime = "nodejs";

const CATEGORIES: StoryboardCategory[] = [
  "thought",
  "suggestion",
  "idea",
  "random",
];

const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;

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
      .select("id, name, category, message, created_at, is_approved")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      data: (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        message: row.message,
        createdAt: row.created_at,
        isApproved: row.is_approved,
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
  let body: { name?: string; category?: string; message?: string };
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

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("storyboard")
      .insert({
        name,
        category,
        message,
        is_approved: true,
      })
      .select("id, name, category, message, created_at, is_approved")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        data: {
          id: data.id,
          name: data.name,
          category: data.category,
          message: data.message,
          createdAt: data.created_at,
          isApproved: data.is_approved,
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
