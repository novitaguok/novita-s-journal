export type GuestbookCategory =
  | "thought"
  | "suggestion"
  | "idea"
  | "random";

export interface GuestbookAttachment {
  url: string;
  name: string;
  type: string;
}

export interface GuestbookPost {
  id: string;
  name: string | null;
  category: GuestbookCategory;
  message: string;
  attachmentUrls: GuestbookAttachment[];
  createdAt: string;
  isApproved: boolean;
  isPinned: boolean;
}
