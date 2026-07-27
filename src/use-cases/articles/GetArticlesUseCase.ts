import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";
import { LocalArticlesRepository } from "../../infrastructure/articles/LocalArticlesRepository";
import { SupabaseArticlesRepository } from "../../infrastructure/articles/SupabaseArticlesRepository";

export class GetArticlesUseCase {
  constructor(
    private localRepo: ArticlesRepository = new LocalArticlesRepository(),
    private dbRepo: ArticlesRepository = new SupabaseArticlesRepository()
  ) {}

  async executeList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
    source?: "local" | "db";
  }): Promise<ArticleListItem[]> {
    if (opts?.source === "db") {
      return this.dbRepo.getArticleList(opts);
    }
    // Default to local/markdown articles as per existing behavior in `/api/articles`
    return this.localRepo.getArticleList(opts);
  }

  async executeGet(slug: string, source: "local" | "db" = "local"): Promise<Article | null> {
    if (source === "db") {
      return this.dbRepo.getArticle(slug);
    }
    return this.localRepo.getArticle(slug);
  }

  async executeGetSlugs(source: "local" | "db" = "local"): Promise<string[]> {
    if (source === "db") {
      return this.dbRepo.getArticleSlugs();
    }
    return this.localRepo.getArticleSlugs();
  }

  async executeIncrementViews(slug: string): Promise<void> {
    // Increment views only makes sense in the database context
    await this.dbRepo.incrementViews(slug);
  }
}
