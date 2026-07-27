import { ArticlesRepository } from '../../domain/articles/repository';
import { Article, ArticleListItem } from '../../domain/articles/types';
import { supabase, supabaseAdmin } from '../supabase/SupabaseClient';

export class SupabaseArticlesRepository implements ArticlesRepository {
  private toArticle(row: any): Article {
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

  async getArticleList(opts?: {
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

    if (opts?.tag && opts.tag !== "all") {
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
    return (data ?? []).map(row => this.toArticle(row));
  }

  async getArticle(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) return null;
    return this.toArticle(data);
  }

  async getArticleSlugs(): Promise<string[]> {
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("is_published", true);

    return data?.map((r) => r.slug) ?? [];
  }

  async incrementViews(slug: string): Promise<void> {
    await supabaseAdmin.rpc("increment_views");
  }

  async upsertArticle(article: Article): Promise<void> {
    const { error } = await supabaseAdmin
      .from("articles")
      .upsert({
        id: article.id,
        slug: article.slug,
        title: article.title,
        tag: article.tag,
        excerpt: article.excerpt,
        body: article.body,
        read_time: article.readTime,
        is_published: article.isPublished,
        published_at: article.publishedAt,
        created_at: article.createdAt,
        updated_at: article.updatedAt,
      });
    if (error) throw new Error(error.message);
  }
}
