import { NextRequest, NextResponse } from "next/server";
import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const useCase = new GetArticlesUseCase();
    const article = await useCase.executeGet(slug);

    if (!article) {
      return NextResponse.json(
        { data: null, error: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: article, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}
