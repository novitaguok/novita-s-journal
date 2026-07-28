import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";
import { LocalArticlesRepository } from "../../infrastructure/articles/LocalArticlesRepository";
import { DevToArticlesRepository } from "../../infrastructure/articles/DevToArticlesRepository";

export class GetArticlesUseCase {
  constructor(
    private localRepo: ArticlesRepository = new LocalArticlesRepository(),
    private devToRepo: ArticlesRepository = new DevToArticlesRepository()
  ) {}

  async executeList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
    source?: "local" | "devto";
  }): Promise<ArticleListItem[]> {
    if (opts?.source === "local") {
      return this.localRepo.getArticleList(opts);
    }
    // Default to Dev.to
    return this.devToRepo.getArticleList(opts);
  }

  async executeGet(slug: string, source: "local" | "devto" = "devto"): Promise<Article | null> {
    if (source === "local") {
      return this.localRepo.getArticle(slug);
    }
    return this.devToRepo.getArticle(slug);
  }

  async executeGetSlugs(source: "local" | "devto" = "devto"): Promise<string[]> {
    if (source === "local") {
      return this.localRepo.getArticleSlugs();
    }
    return this.devToRepo.getArticleSlugs();
  }

  async executeIncrementViews(slug: string): Promise<void> {
    // Dev.to handles page views internally
  }
}
