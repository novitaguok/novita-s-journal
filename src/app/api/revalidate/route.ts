import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
