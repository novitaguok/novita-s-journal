import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArticlesRepository } from '../../domain/articles/repository';
import { Article, ArticleListItem } from '../../domain/articles/types';
import { mapTagsToCategory, mapTagsToCategories } from '../../lib/data';

export class LocalArticlesRepository implements ArticlesRepository {
  private contentDir = path.join(process.cwd(), 'content/articles');

  private calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  async getArticle(slug: string): Promise<Article | null> {
    try {
      const filePath = path.join(this.contentDir, `${slug}.md`);
      if (!fs.existsSync(filePath)) return null;
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Prefer the frontmatter slug over the filename so local dev stays
      // consistent with the GitHub-as-CMS naming convention.
      const resolvedSlug = data.slug || slug;
      const mappedTags = mapTagsToCategories(data.tags || data.tag);

      return {
        id: data.id || data.cuid || resolvedSlug,
        slug: resolvedSlug,
        title: data.title || 'Untitled',
        tag: mappedTags[0] || mapTagsToCategory(data.tags || data.tag),
        tags: mappedTags,
        excerpt: data.excerpt || data.description || '',
        body: content,
        readTime: data.readTime || this.calculateReadTime(content),
        views: 0,
        isPublished: data.isPublished !== false,
        publishedAt: data.date || data.datePublished || new Date().toISOString(),
        createdAt: data.date || data.datePublished || new Date().toISOString(),
        updatedAt: data.updatedAt || data.date || data.datePublished || new Date().toISOString(),
      };
    } catch (err) {
      return null;
    }
  }

  async getArticleList(opts?: {
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<ArticleListItem[]> {
    try {
      if (!fs.existsSync(this.contentDir)) return [];
      const fileNames = fs.readdirSync(this.contentDir);
      let articles: ArticleListItem[] = [];

      for (const fileName of fileNames) {
        if (!fileName.endsWith('.md')) continue;
        
        const slug = fileName.replace(/\.md$/, '');
        const filePath = path.join(this.contentDir, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        if (data.isPublished === false) continue;

        const resolvedSlug = data.slug || slug;
        const mappedTags = mapTagsToCategories(data.tags || data.tag);

        articles.push({
          id: data.id || data.cuid || resolvedSlug,
          slug: resolvedSlug,
          title: data.title || 'Untitled',
          tag: mappedTags[0] || mapTagsToCategory(data.tags || data.tag),
          tags: mappedTags,
          excerpt: data.excerpt || data.description || '',
          readTime: data.readTime || this.calculateReadTime(content),
          views: 0,
          isPublished: true,
          publishedAt: data.date || data.datePublished || new Date().toISOString(),
          createdAt: data.date || data.datePublished || new Date().toISOString(),
          updatedAt: data.updatedAt || data.date || data.datePublished || new Date().toISOString(),
        });
      }

      // Sort by date (newest first)
      articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      if (opts?.tag && opts.tag !== 'all') {
        articles = articles.filter(a =>
          a.tags ? a.tags.some(t => t.toLowerCase() === opts.tag!.toLowerCase()) : a.tag.toLowerCase() === opts.tag!.toLowerCase()
        );
      }

      if (opts?.search) {
        const q = opts.search.toLowerCase();
        articles = articles.filter(
          a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
        );
      }

      if (opts?.limit) {
        articles = articles.slice(0, opts.limit);
      }

      return articles;
    } catch (err) {
      return [];
    }
  }

  async getArticleSlugs(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.contentDir)) return [];
      const fileNames = fs.readdirSync(this.contentDir);
      return fileNames
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const filePath = path.join(this.contentDir, f);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);
          // Prefer frontmatter slug so static params match article page URLs.
          return data.slug || f.replace(/\.md$/, '');
        });
    } catch (err) {
      return [];
    }
  }

  async incrementViews(slug: string): Promise<void> {
    // Local storage doesn't track views. No-op.
  }
}
