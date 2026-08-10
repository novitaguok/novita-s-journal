import { createSupabaseServerClient } from "../../lib/supabase/server";
import {
  GuestbookPost,
  GuestbookCategory,
  GuestbookAttachment,
} from "../../domain/guestbook/types";
import {
  GuestbookRepository,
  isAttachment,
} from "../../domain/guestbook/repository";

const MAX_ATTACHMENTS = 4;

const SELECT_COLUMNS =
  "id, name, category, message, attachment_urls, created_at, is_approved, is_pinned";

function mapRowToPost(row: Record<string, unknown>): GuestbookPost {
  return {
    id: String(row.id),
    name: typeof row.name === "string" ? row.name : null,
    category: row.category as GuestbookCategory,
    message: String(row.message ?? ""),
    attachmentUrls: Array.isArray(row.attachment_urls)
      ? row.attachment_urls.filter(isAttachment).slice(0, MAX_ATTACHMENTS)
      : [],
    createdAt: String(row.created_at ?? ""),
    isApproved: row.is_approved !== false,
    isPinned: row.is_pinned === true,
  };
}

export class SupabaseGuestbookRepository implements GuestbookRepository {
  async listApproved(limit: number): Promise<GuestbookPost[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("guestbook")
      .select(SELECT_COLUMNS)
      .eq("is_approved", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => mapRowToPost(row as Record<string, unknown>));
  }

  async createPost(input: {
    name: string | null;
    category: GuestbookCategory;
    message: string;
    attachmentUrls: GuestbookAttachment[];
  }): Promise<GuestbookPost> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("guestbook")
      .insert({
        name: input.name,
        category: input.category,
        message: input.message,
        attachment_urls: input.attachmentUrls,
        is_approved: true,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;
    return mapRowToPost(data as Record<string, unknown>);
  }

  async setPinned(id: string, pinned: boolean): Promise<GuestbookPost> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("guestbook")
      .update({ is_pinned: pinned })
      .eq("id", id)
      .select(SELECT_COLUMNS)
      .single();

    if (error) throw error;
    return mapRowToPost(data as Record<string, unknown>);
  }
}
