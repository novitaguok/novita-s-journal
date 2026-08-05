import { ProjectsRepository } from "../../domain/projects/repository";
import { Project } from "../../domain/projects/types";
import { GitHubProjectsRepository } from "../../infrastructure/projects/GitHubProjectsRepository";
import { CUSTOM_SNIPPETS } from "../../lib/data";

export class GetProjectsUseCase {
  constructor(
    private projectsRepo: ProjectsRepository = new GitHubProjectsRepository()
  ) {}

  private generateSnippet(repoName: string, language: string | null, stars: number, description: string | null): string {
    const cleanRepoName = repoName.replace(/[^a-zA-Z0-9_]/g, '_') || 'project';
    const safeDesc = (description || '').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 80) + 
      ((description && description.length > 80) ? '...' : '');
    const lang = (language || 'text').toLowerCase();
    
    if (lang === 'python') {
      return `class ${cleanRepoName}:\n    language = "${language || 'Python'}"\n    stars = ${stars}\n    description = "${safeDesc}"`;
    }
    if (lang === 'java' || lang === 'kotlin') {
      return `public class ${cleanRepoName} {\n    String lang = "${language || 'Java'}";\n    int stars = ${stars};\n}`;
    }
    if (lang === 'dart') {
      return `class ${cleanRepoName} {\n  final String lang = "${language || 'Dart'}";\n  final int stars = ${stars};\n}`;
    }
    if (lang === 'html' || lang === 'css') {
      return `<div id="${cleanRepoName}">\n  <span class="lang">${language || 'HTML'}</span>\n  <span class="stars">${stars}</span>\n</div>`;
    }
    
    return `const ${cleanRepoName} = {\n  lang: "${language || 'Unknown'}",\n  stars: ${stars},\n  desc: "${safeDesc}"\n};`;
  }

  async execute(opts?: {
    status?: "active" | "stable" | "archived";
    pinnedOnly?: boolean;
  }): Promise<Project[]> {
    let projects = await this.projectsRepo.getProjects(opts);

    // Attach snippets
    projects = projects.map((p) => {
      const customSnippet = CUSTOM_SNIPPETS[p.repo];
      return {
        ...p,
        snippet:
          customSnippet ||
          this.generateSnippet(p.title, p.lang, p.stars, p.desc),
      };
    });

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
