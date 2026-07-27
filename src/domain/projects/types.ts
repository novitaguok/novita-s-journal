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
  demoUrl?: string | null;
  year: string;
  snippet: string | null;
  sortOrder: number;
  createdAt: string;
}
