import { getArticle } from "@/src/lib/articles-local";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return NextResponse.json(
      { data: null, error: "Article not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: article, error: null });
}
