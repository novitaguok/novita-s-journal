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
    if (opts?.source === "devto") {
      return this.devToRepo.getArticleList(opts);
    }
    // Default to local/markdown articles
    return this.localRepo.getArticleList(opts);
  }

  async executeGet(slug: string, source: "local" | "devto" = "local"): Promise<Article | null> {
    if (source === "devto") {
      return this.devToRepo.getArticle(slug);
    }
    return this.localRepo.getArticle(slug);
  }

  async executeGetSlugs(source: "local" | "devto" = "local"): Promise<string[]> {
    if (source === "devto") {
      return this.devToRepo.getArticleSlugs();
    }
    return this.localRepo.getArticleSlugs();
  }

  async executeIncrementViews(slug: string): Promise<void> {
    // Dev.to handles page views internally
  }
}
