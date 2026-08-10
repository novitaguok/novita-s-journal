import { NextRequest, NextResponse } from "next/server";
import { GetProjectsUseCase } from "@/src/use-cases/projects/GetProjectsUseCase";
import { GitHubProjectsRepository } from "@/src/infrastructure/projects/GitHubProjectsRepository";
import { CUSTOM_SNIPPETS } from "@/src/lib/data";
import { errorMessage } from "@/src/lib/errors";

function generateSnippet(
  repoName: string,
  language: string | null,
  stars: number,
  description: string | null,
): string {
  const cleanRepoName = repoName.replace(/[^a-zA-Z0-9_]/g, "_") || "project";
  const safeDesc =
    (description || "").replace(/"/g, '\\"').replace(/\n/g, " ").substring(0, 80) +
    (description && description.length > 80 ? "..." : "");
  const lang = (language || "text").toLowerCase();

  if (lang === "python") {
    return `class ${cleanRepoName}:\n    language = "${language || "Python"}"\n    stars = ${stars}\n    description = "${safeDesc}"`;
  }
  if (lang === "java" || lang === "kotlin") {
    return `public class ${cleanRepoName} {\n    String lang = "${language || "Java"}";\n    int stars = ${stars};\n}`;
  }
  if (lang === "dart") {
    return `class ${cleanRepoName} {\n  final String lang = "${language || "Dart"}";\n  final int stars = ${stars};\n}`;
  }
  if (lang === "html" || lang === "css") {
    return `<div id="${cleanRepoName}">\n  <span class="lang">${language || "HTML"}</span>\n  <span class="stars">${stars}</span>\n</div>`;
  }

  return `const ${cleanRepoName} = {\n  lang: "${language || "Unknown"}",\n  stars: ${stars},\n  desc: "${safeDesc}"\n};`;
}

function createSnippetProvider() {
  return (project: {
    repo: string;
    title: string;
    lang: string;
    stars: number;
    desc: string;
  }) =>
    CUSTOM_SNIPPETS[project.repo] ||
    generateSnippet(project.title, project.lang, project.stars, project.desc);
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "active" || statusParam === "stable" || statusParam === "archived"
      ? statusParam
      : undefined;
  const pinnedOnly = searchParams.get("isPinned") === "true";

  try {
    const useCase = new GetProjectsUseCase(
      new GitHubProjectsRepository(),
      createSnippetProvider(),
    );
    const projects = await useCase.execute({ status, pinnedOnly });
    return NextResponse.json({ data: projects, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: [], error: errorMessage(err) },
      { status: 500 },
    );
  }
}
