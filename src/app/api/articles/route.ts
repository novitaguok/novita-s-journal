import { NextRequest, NextResponse } from "next/server";
import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  try {
    const useCase = new GetArticlesUseCase();
    const articleList = await useCase.executeList({ tag, search, limit, source: "devto" });
    return NextResponse.json({ data: articleList, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}
