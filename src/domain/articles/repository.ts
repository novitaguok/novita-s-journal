import { Article, ArticleListItem } from "./types";

export interface ArticlesRepository {
  getArticleList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<ArticleListItem[]>;

  getArticle(slug: string): Promise<Article | null>;

  getArticleSlugs(): Promise<string[]>;

  incrementViews(slug: string): Promise<void>;
}
