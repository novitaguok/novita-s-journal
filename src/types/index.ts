export type Section = "home" | "articles" | "projects" | "about";

export interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  readTime: string;
  lines: number;
  views: number;
  preview: string;
}

export interface Project {
  id: number;
  repo: string;
  title: string;
  desc: string;
  longDesc: string;
  stack: string[];
  lang: string;
  langColor: string;
  stars: number;
  forks: number;
  year: string;
  snippet: string;
  pinned: boolean;
  status: "active" | "stable" | "archived";
  demoUrl?: string;
}

export interface About {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
