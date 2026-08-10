import { GuestbookAttachment, GuestbookCategory, GuestbookPost } from "./types";

export function isAttachment(value: unknown): value is GuestbookAttachment {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.url === "string" &&
    a.url.startsWith("http") &&
    typeof a.name === "string" &&
    typeof a.type === "string"
  );
}

export interface GuestbookRepository {
  listApproved(limit: number): Promise<GuestbookPost[]>;
  createPost(input: {
    name: string | null;
    category: GuestbookCategory;
    message: string;
    attachmentUrls: GuestbookAttachment[];
  }): Promise<GuestbookPost>;
  setPinned(id: string, pinned: boolean): Promise<GuestbookPost>;
}
