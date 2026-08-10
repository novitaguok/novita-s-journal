import { ProjectsRepository } from "../../domain/projects/repository";
import { Project } from "../../domain/projects/types";

export type SnippetProvider = (project: Project) => string;

export class GetProjectsUseCase {
  constructor(
    private projectsRepo: ProjectsRepository,
    private snippetProvider: SnippetProvider,
  ) {}

  async execute(opts?: {
    status?: "active" | "stable" | "archived";
    pinnedOnly?: boolean;
  }): Promise<Project[]> {
    let projects = await this.projectsRepo.getProjects(opts);

    // Attach snippets
    projects = projects.map((p) => ({
      ...p,
      snippet: this.snippetProvider(p),
    }));

    const hasPinnedFromRepo = projects.some((p) => p.isPinned);

    // Fallback: If no projects were dynamically pinned by repository, pin top 6 starred repos
    if (!hasPinnedFromRepo) {
      const sortedByStars = [...projects].sort((a, b) => b.stars - a.stars);
      const top6RepoNames = new Set(
        sortedByStars.slice(0, 6).map((p) => p.repo)
      );
      projects.forEach((p) => {
        if (top6RepoNames.has(p.repo)) {
          p.isPinned = true;
        }
      });
    }

    if (opts?.pinnedOnly) {
      projects = projects.filter((p) => p.isPinned);
    }
    if (opts?.status) {
      projects = projects.filter((p) => p.status === opts.status);
    }

    return projects;
  }
}
