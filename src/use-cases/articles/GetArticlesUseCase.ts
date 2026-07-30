import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";
import { LocalArticlesRepository } from "../../infrastructure/articles/LocalArticlesRepository";
import { GitHubArticlesRepository } from "../../infrastructure/articles/GitHubArticlesRepository";

type ArticleSource = "local" | "github";

function createDefaultRepo(): ArticlesRepository {
  // Use local filesystem in development to avoid hitting GitHub API on every hot reload.
  // Override with GITHUB_USE_LOCAL=true in production if needed for testing.
  const useLocal =
    process.env.NODE_ENV === "development" ||
    process.env.GITHUB_USE_LOCAL === "true";
  return useLocal ? new LocalArticlesRepository() : new GitHubArticlesRepository();
}

export class GetArticlesUseCase {
  private readonly primaryRepo: ArticlesRepository;
  private readonly localRepo: ArticlesRepository;
  private readonly githubRepo: ArticlesRepository;

  constructor() {
    this.localRepo = new LocalArticlesRepository();
    this.githubRepo = new GitHubArticlesRepository();
    this.primaryRepo = createDefaultRepo();
  }

  private repoFor(source?: ArticleSource): ArticlesRepository {
    switch (source) {
      case "local":
        return this.localRepo;
      case "github":
        return this.githubRepo;
      default:
        return this.primaryRepo;
    }
  }

  async executeList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
    source?: ArticleSource;
  }): Promise<ArticleListItem[]> {
    return this.repoFor(opts?.source).getArticleList(opts);
  }

  async executeGet(slug: string, source?: ArticleSource): Promise<Article | null> {
    return this.repoFor(source).getArticle(slug);
  }

  async executeGetSlugs(source?: ArticleSource): Promise<string[]> {
    return this.repoFor(source).getArticleSlugs();
  }

  async executeIncrementViews(): Promise<void> {
    // No-op: views are not tracked in the GitHub-as-CMS model.
  }
}
