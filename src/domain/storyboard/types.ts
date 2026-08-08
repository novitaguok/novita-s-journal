export type StoryboardCategory =
  | "thought"
  | "suggestion"
  | "idea"
  | "random";

export interface StoryboardPost {
  id: string;
  name: string | null;
  category: StoryboardCategory;
  message: string;
  createdAt: string;
  isApproved: boolean;
}
