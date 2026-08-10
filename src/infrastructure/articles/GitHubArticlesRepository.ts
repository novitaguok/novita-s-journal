import matter from "gray-matter";
import { ArticlesRepository } from "../../domain/articles/repository";
import { Article, ArticleListItem } from "../../domain/articles/types";
import { mapTagsToCategory, mapTagsToCategories } from "../../lib/data";

const CACHE_TAG_ALL = "articles";
const cacheTagFor = (slug: string) => `article-${slug}`;

/**
 * Fetches article markdown from the GitHub raw content API at request time.
 * Uses Next.js cache tags so that individual articles (or the full list) can
 * be surgically invalidated via revalidateTag() without a full redeploy.
 */
export class GitHubArticlesRepository implements ArticlesRepository {
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;
  private readonly contentPath = "content/articles";
  private readonly token: string | undefined;

  constructor() {
    this.owner = process.env.GITHUB_OWNER ?? "novitaguok";
    this.repo = process.env.GITHUB_REPO ?? "novita-s-journal";
    this.branch = process.env.GITHUB_BRANCH ?? "main";
    this.token = process.env.GITHUB_TOKEN;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private get authHeaders(): HeadersInit {
    return this.token
      ? { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.github+json" }
      : { Accept: "application/vnd.github+json" };
  }

  private rawUrl(slug: string): string {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.contentPath}/${slug}.md`;
  }

  private contentsApiUrl(): string {
    return `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.contentPath}`;
  }

  private calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  private parseMarkdown(rawMarkdown: string, slug: string): Article {
    const { data, content } = matter(rawMarkdown);
    const mappedTags = mapTagsToCategories(data.tags || data.tag);
    return {
      id: data.id ?? data.cuid ?? slug,
      slug: data.slug ?? slug,
      title: data.title ?? "Untitled",
      tag: mappedTags[0] || mapTagsToCategory(data.tags || data.tag),
      tags: mappedTags,
      excerpt: data.excerpt ?? data.description ?? "",
      body: content,
      readTime: data.readTime ?? this.calculateReadTime(content),
      isPublished: data.isPublished !== false,
      publishedAt: data.date ?? data.datePublished ?? new Date().toISOString(),
      createdAt: data.date ?? data.datePublished ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? data.date ?? data.datePublished ?? new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // ArticlesRepository implementation
  // ---------------------------------------------------------------------------

  async getArticleList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<ArticleListItem[]> {
    // Step 1: list all .md files via the GitHub Contents API
    const dirRes = await fetch(this.contentsApiUrl(), {
      headers: this.authHeaders,
      next: { tags: [CACHE_TAG_ALL] },
    });

    if (!dirRes.ok) {
      throw new Error(
        `GitHub API error listing articles: ${dirRes.status} ${dirRes.statusText}`
      );
    }

    const entries: Array<{ name: string; type: string }> = await dirRes.json();
    const mdFiles = entries.filter(
      (e) => e.type === "file" && e.name.endsWith(".md")
    );

    // Step 2: fetch each file concurrently
    const articles = await Promise.all(
      mdFiles.map(async (entry) => {
        const slug = entry.name.replace(/\.md$/, "");
        const rawRes = await fetch(this.rawUrl(slug), {
          next: { tags: [CACHE_TAG_ALL, cacheTagFor(slug)] },
        });

        if (!rawRes.ok) return null;
        const raw = await rawRes.text();
        const parsed = this.parseMarkdown(raw, slug);
        if (!parsed.isPublished) return null;

        const listItem: ArticleListItem = {
          id: parsed.id,
          slug: parsed.slug,
          title: parsed.title,
          tag: parsed.tag,
          tags: parsed.tags,
          excerpt: parsed.excerpt,
          readTime: parsed.readTime,
          isPublished: parsed.isPublished,
          publishedAt: parsed.publishedAt,
          createdAt: parsed.createdAt,
          updatedAt: parsed.updatedAt,
        };
        return listItem;
      })
    );

    let result = articles.filter((a): a is ArticleListItem => a !== null);

    // Sort newest first
    result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    if (opts?.tag && opts.tag !== "all") {
      result = result.filter((a) =>
        a.tags
          ? a.tags.some((t) => t.toLowerCase() === opts.tag!.toLowerCase())
          : a.tag.toLowerCase() === opts.tag!.toLowerCase()
      );
    }

    if (opts?.search) {
      const q = opts.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      );
    }

    if (opts?.limit) {
      result = result.slice(0, opts.limit);
    }

    return result;
  }

  async getArticle(slug: string): Promise<Article | null> {
    const res = await fetch(this.rawUrl(slug), {
      next: { tags: [CACHE_TAG_ALL, cacheTagFor(slug)] },
    });

    if (!res.ok) return null;

    const raw = await res.text();
    return this.parseMarkdown(raw, slug);
  }

  async getArticleSlugs(): Promise<string[]> {
    const dirRes = await fetch(this.contentsApiUrl(), {
      headers: this.authHeaders,
      next: { tags: [CACHE_TAG_ALL] },
    });

    if (!dirRes.ok) return [];

    const entries: Array<{ name: string; type: string }> = await dirRes.json();
    return entries
      .filter((e) => e.type === "file" && e.name.endsWith(".md"))
      .map((e) => e.name.replace(/\.md$/, ""));
  }
}
