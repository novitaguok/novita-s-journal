export type Section = "home" | "articles" | "projects" | "about";

export interface Article {
  id: number;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  body: string;
  readTime: number;
  views: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
export type ArticleListItem = Omit<Article, "body">;

export interface Project {
  id: number;
  repo: string;
  title: string;
  desc: string;
  longDesc: string | null;
  stack: string[];
  lang: string;
  langColor: string;
  stars: number;
  forks: number;
  status: "active" | "stable" | "archived";
  isPinned: boolean;
  demoUrl?: string;
  year: string;
  snippet: string;
  sortOrder: number;
  createdAt: string;
}

export interface About {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
