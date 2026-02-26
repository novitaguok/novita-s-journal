import { getArticleList } from "@/src/lib/articles-local";
import { NextRequest, NextResponse } from "next/server";

// Node.js runtime is required for fs module
// export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  try {
    const articleList = await getArticleList({ tag, search, limit });
    return NextResponse.json({ data: articleList, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}
