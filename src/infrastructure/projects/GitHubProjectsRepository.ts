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

  private async fetchPinnedFromGraphQL(username: string): Promise<Project[]> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return [];

    const query = `
      query($userName: String!) {
        user(login: $userName) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                databaseId
                name
                nameWithOwner
                description
                stargazerCount
                forkCount
                isArchived
                pushedAt
                createdAt
                homepageUrl
                primaryLanguage {
                  name
                  color
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { userName: username } }),
        next: { revalidate: 3600 },
      });

      if (!res.ok) return [];

      const json = await res.json();
      const nodes = json?.data?.user?.pinnedItems?.nodes;
      if (!Array.isArray(nodes)) return [];

      return nodes.map((node: any, idx: number) => {
        const lang = node.primaryLanguage?.name || "Markdown";
        const langColor = node.primaryLanguage?.color || this.getLangColor(lang);
        const stack =
          node.repositoryTopics?.nodes?.map((t: any) => t.topic.name) || [];

        return {
          id: node.databaseId || idx,
          repo: node.nameWithOwner,
          title: node.name,
          isPinned: true,
          status: node.isArchived
            ? "archived"
            : new Date(node.pushedAt) >
              new Date(Date.now() - 1000 * 60 * 60 * 24 * 180)
            ? "active"
            : "stable",
          desc: node.description || "No description provided.",
          longDesc: node.description || "No description provided.",
          stack,
          lang,
          langColor,
          stars: node.stargazerCount || 0,
          forks: node.forkCount || 0,
          year: new Date(node.createdAt).getFullYear().toString(),
          demoUrl: node.homepageUrl || null,
          snippet: null,
          sortOrder: idx,
          createdAt: node.createdAt,
        };
      });
    } catch {
      return [];
    }
  }

  async getProjects(opts?: {
    status?: "active" | "stable" | "archived";
    pinnedOnly?: boolean;
  }): Promise<Project[]> {
    const username = "novitaguok";

    const [pinnedProjects, githubRes] = await Promise.all([
      this.fetchPinnedFromGraphQL(username),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
        {
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!githubRes.ok) throw new Error("Failed to fetch from GitHub API");

    const githubRepos = await githubRes.json();
    const pinnedRepoNames = new Set(pinnedProjects.map((p) => p.repo));

    const restProjects: Project[] = githubRepos
      .filter((r: any) => !pinnedRepoNames.has(r.full_name))
      .map((r: any, idx: number) => ({
        id: r.id,
        repo: r.full_name,
        title: r.name,
        isPinned: false,
        status: r.archived
          ? "archived"
          : new Date(r.pushed_at) >
            new Date(Date.now() - 1000 * 60 * 60 * 24 * 180)
          ? "active"
          : "stable",
        desc: r.description || "No description provided.",
        longDesc: r.description || "No description provided.",
        stack: r.topics || [],
        lang: r.language || "Markdown",
        langColor: this.getLangColor(r.language),
        stars: r.stargazers_count,
        forks: r.forks_count,
        year: new Date(r.created_at).getFullYear().toString(),
        demoUrl: r.homepage || null,
        snippet: null,
        sortOrder: pinnedProjects.length + idx,
        createdAt: r.created_at,
      }));

    return [...pinnedProjects, ...restProjects];
  }
}

