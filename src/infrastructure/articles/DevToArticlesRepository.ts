import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";

export class DevToArticlesRepository implements ArticlesRepository {
  private username = process.env.DEVTO_USERNAME || "novitaguok";

  async getArticleList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<ArticleListItem[]> {
    const limit = opts?.limit ?? 30;
    const res = await fetch(`https://dev.to/api/articles?username=${this.username}&per_page=${limit}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to fetch articles from Dev.to");
    const devToArticles = await res.ok ? await res.json() : [];

    let articles: ArticleListItem[] = devToArticles.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      tag: post.tag_list?.[0] || "engineering",
      excerpt: post.description || "",
      readTime: post.reading_time_minutes || 1,
      views: post.page_views_count || 0,
      isPublished: true,
      publishedAt: post.published_at,
      createdAt: post.published_at,
      updatedAt: post.edited_at || post.published_at
    }));

    if (opts?.tag && opts.tag !== "all") {
      articles = articles.filter(a => a.tag.toLowerCase() === opts.tag?.toLowerCase());
    }

    if (opts?.search) {
      const q = opts.search.toLowerCase();
      articles = articles.filter(
        a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    return articles;
  }

  async getArticle(slug: string): Promise<Article | null> {
    const res = await fetch(`https://dev.to/api/articles/${this.username}/${slug}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;
    const post = await res.json();

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      tag: post.tag_list?.[0] || "engineering",
      excerpt: post.description || "",
      body: post.body_markdown || "",
      readTime: post.reading_time_minutes || 1,
      views: post.page_views_count || 0,
      isPublished: true,
      publishedAt: post.published_at,
      createdAt: post.published_at,
      updatedAt: post.edited_at || post.published_at
    };
  }

  async getArticleSlugs(): Promise<string[]> {
    const list = await this.getArticleList();
    return list.map(item => item.slug);
  }

  async incrementViews(slug: string): Promise<void> {
    // Dev.to handles page views on their own platform. No-op.
  }
}
