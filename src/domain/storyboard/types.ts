export type StoryboardCategory =
  | "thought"
  | "suggestion"
  | "idea"
  | "random";

export interface StoryboardAttachment {
  url: string;
  name: string;
  type: string;
}

export interface StoryboardPost {
  id: string;
  name: string | null;
  category: StoryboardCategory;
  message: string;
  attachmentUrls: StoryboardAttachment[];
  createdAt: string;
  isApproved: boolean;
  isPinned: boolean;
}
