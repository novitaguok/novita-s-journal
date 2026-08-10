export interface Article {
  id: number | string;
  slug: string;
  title: string;
  tag: string;
  tags: string[];
  excerpt: string;
  body: string;
  readTime: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ArticleListItem = Omit<Article, "body">;
