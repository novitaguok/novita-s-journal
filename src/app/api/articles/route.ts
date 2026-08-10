import { NextRequest, NextResponse } from "next/server";
import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";
import { createArticlesRepositories } from "@/src/infrastructure/articles/repositories";
import { errorMessage } from "@/src/lib/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  try {
    const { primary, local, github } = createArticlesRepositories();
    const useCase = new GetArticlesUseCase(primary, local, github);
    const articleList = await useCase.executeList({ tag, search, limit });
    return NextResponse.json({ data: articleList, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: errorMessage(err) },
      { status: 500 },
    );
  }
}
