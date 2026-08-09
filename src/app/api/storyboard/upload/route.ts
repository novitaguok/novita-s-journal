import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const BUCKET = "storyboard-attachments";
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { data: null, error: "No file provided" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        data: null,
        error: `Unsupported file type: ${file.type || "unknown"}`,
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { data: null, error: "File must be under 8MB" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    // Ensure the bucket exists (idempotent).
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      const { error: createError } = await supabase.storage.createBucket(
        BUCKET,
        { public: true },
      );
      if (createError) throw createError;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const path = `${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return NextResponse.json(
      {
        data: {
          url: publicUrl.publicUrl,
          name: file.name,
          type: file.type,
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
