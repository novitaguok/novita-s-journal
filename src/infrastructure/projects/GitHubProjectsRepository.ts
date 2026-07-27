import { ProjectsRepository } from "../../domain/projects/repository";
import { Project } from "../../domain/projects/types";

export class GitHubProjectsRepository implements ProjectsRepository {
  private getLangColor(lang: string | null): string {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Vue: "#41b883",
      Rust: "#dea584",
    };
    return lang && colors[lang] ? colors[lang] : "#8b949e";
  }

  async getProjects(opts?: {
    status?: "active" | "stable" | "archived";
    pinnedOnly?: boolean;
  }): Promise<Project[]> {
    const githubRes = await fetch("https://api.github.com/users/novitaguok/repos?per_page=100&sort=pushed", {
      next: { revalidate: 3600 }
    });
    
    if (!githubRes.ok) throw new Error("Failed to fetch from GitHub API");

    const githubRepos = await githubRes.json();

    const pinnedRepoNames = [
      "Owlite-Team/shelter-it-be",
      "Owlite-Team/noveats-be",
      "Owlite-Team/shelter-it-android",
      "Owlite-Team/cinlok-be"
    ];

    const extraRepoPromises = pinnedRepoNames.map(repo => 
      fetch(`https://api.github.com/repos/${repo}`, { next: { revalidate: 3600 } })
        .then(res => res.ok ? res.json() : null)
    );
    const extraReposData = (await Promise.all(extraRepoPromises)).filter(Boolean);
    githubRepos.push(...extraReposData);

    // Map GitHub repos to Project interface
    const projects: Project[] = githubRepos.map((r: any, idx: number) => ({
      id: r.id,
      repo: r.full_name,
      title: r.name,
      isPinned: false,
      status: r.archived 
        ? "archived" 
        : (new Date(r.pushed_at) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 180) ? "active" : "stable"),
      desc: r.description || "No description provided.",
      longDesc: r.description || "No description provided.",
      stack: r.topics || [],
      lang: r.language || "Markdown",
      langColor: this.getLangColor(r.language),
      stars: r.stargazers_count,
      forks: r.forks_count,
      year: new Date(r.created_at).getFullYear().toString(),
      demoUrl: r.homepage || null,
      snippet: null, // snippet formatting logic will live in Use Case
      sortOrder: idx,
      createdAt: r.created_at,
    }));

    return projects;
  }
}
