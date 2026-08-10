import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";

export type ArticleSource = "local" | "github";

export class GetArticlesUseCase {
  private readonly primaryRepo: ArticlesRepository;
  private readonly localRepo: ArticlesRepository;
  private readonly githubRepo: ArticlesRepository;

  constructor(
    primaryRepo: ArticlesRepository,
    localRepo: ArticlesRepository,
    githubRepo: ArticlesRepository,
  ) {
    this.primaryRepo = primaryRepo;
    this.localRepo = localRepo;
    this.githubRepo = githubRepo;
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
}
