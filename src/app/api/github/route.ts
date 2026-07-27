import { NextResponse } from "next/server";
import { GetGithubContributionsUseCase } from "@/src/use-cases/github/GetGithubContributionsUseCase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const useCase = new GetGithubContributionsUseCase();
    const data = await useCase.execute(username);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
