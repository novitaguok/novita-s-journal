export type Section = "home" | "articles" | "projects" | "about";

export interface About {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
