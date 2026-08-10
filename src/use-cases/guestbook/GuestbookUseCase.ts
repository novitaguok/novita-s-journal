import {
  GuestbookCategory,
  GuestbookPost,
} from "../../domain/guestbook/types";
import {
  GuestbookRepository,
  isAttachment,
} from "../../domain/guestbook/repository";

const CATEGORIES: GuestbookCategory[] = [
  "thought",
  "suggestion",
  "idea",
  "random",
];

const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;
const MAX_ATTACHMENTS = 4;

export class GuestbookUseCase {
  constructor(private readonly repo: GuestbookRepository) {}

  async listApproved(limit?: number): Promise<GuestbookPost[]> {
    const bounded = Math.min(Math.max(limit ?? 50, 1), 100);
    return this.repo.listApproved(bounded);
  }

  async createPost(input: {
    name?: string;
    category?: string;
    message?: string;
    attachmentUrls?: unknown;
  }): Promise<GuestbookPost> {
    const category = input.category as GuestbookCategory;
    if (!CATEGORIES.includes(category)) {
      throw new Error(`Category must be one of: ${CATEGORIES.join(", ")}`);
    }

    const message = (input.message ?? "").trim();
    if (!message) {
      throw new Error("Message is required");
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(
        `Message must be under ${MAX_MESSAGE_LENGTH} characters`,
      );
    }

    const name = (input.name ?? "").trim().slice(0, MAX_NAME_LENGTH) || null;

    const attachmentUrls = Array.isArray(input.attachmentUrls)
      ? input.attachmentUrls.filter(isAttachment).slice(0, MAX_ATTACHMENTS)
      : [];

    return this.repo.createPost({
      name,
      category,
      message,
      attachmentUrls,
    });
  }

  async setPinned(id: string, pinned: boolean): Promise<GuestbookPost> {
    if (!id) {
      throw new Error("Missing post id");
    }
    return this.repo.setPinned(id, pinned);
  }
}
