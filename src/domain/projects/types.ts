export type BlockType = "json" | "code" | "terminal" | "commands" | "object";

export interface ProjectSnippet {
  blockType: BlockType;
  filename?: string;
  language?: string;
  code: string;
}

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
  snippet: string | ProjectSnippet | null;
  blockType?: BlockType;
  sortOrder: number;
  createdAt: string;
}

