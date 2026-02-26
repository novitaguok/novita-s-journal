import { createClient } from "@supabase/supabase-js";
import { ArticleListItem, Article, Project } from "../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

function toArticle(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    excerpt: row.excerpt,
    body: row.body ?? "",
    readTime: row.read_time,
    views: row.views ?? 0,
    isPublished: row.is_published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProject(row: any): Project {
  return {
    id: row.id,
    repo: row.repo,
    title: row.title,
    desc: row.desc,
    longDesc: row.long_desc ?? null,
    stack: row.stack ?? [],
    lang: row.lang,
    langColor: row.lang_color,
    stars: row.stars ?? 0,
    forks: row.forks ?? 0,
    status: row.status,
    isPinned: row.is_pinned ?? false,
    demoUrl: row.demo_url ?? null,
    year: row.year,
    snippet: row.snippet ?? null,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

export async function getArticleList(opts?: {
  tag?: string;
  search?: string;
  limit?: number;
}): Promise<ArticleListItem[]> {
  let q = supabase
    .from("articles")
    .select(
      "id,slug,title,tag,excerpt,read_time,views,is_published,published_at,created_at,updated_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (opts?.tag && opts.tag != "all") {
    q = q.eq("tag", opts.tag);
  }

  if (opts?.search) {
    q = q.or(`title.ilike.%${opts.search}%,excerpt.ilike.%${opts.search}%`);
  }

  if (opts?.limit) {
    q = q.limit(opts.limit);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toArticle);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return toArticle(data);
}

export async function incrementViews(slug: string): Promise<void> {
  await supabaseAdmin.rpc("increment_views");
}

export async function getArticleSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("is_published", true);

  return data?.map((r) => r.slug) ?? [];
}

export async function getProjects(opts?: {
  status?: "active" | "stable" | "archived";
  pinnedOnly?: boolean;
}): Promise<Project[]> {
  let q = supabase
    .from("projects")
    .select("*")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (opts?.status) {
    q = q.eq("pinned", true);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProject);
}
