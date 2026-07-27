import { NextRequest, NextResponse } from "next/server";
import { GetProjectsUseCase } from "@/src/use-cases/projects/GetProjectsUseCase";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as any) ?? undefined;
  const pinnedOnly = searchParams.get("isPinned") === "true";

  try {
    const useCase = new GetProjectsUseCase();
    const projects = await useCase.execute({ status, pinnedOnly });
    return NextResponse.json({ data: projects, error: null });
  } catch (err: any) {
    return NextResponse.json(
      { data: [], error: err.message },
      { status: 500 },
    );
  }
}
