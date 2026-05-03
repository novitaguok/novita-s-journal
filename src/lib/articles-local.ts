import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleListItem } from '../types';

const contentDir = path.join(process.cwd(), 'content/articles');

// Helper to calculate read time
function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Fetch a single article by its slug (filename without .md)
export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(contentDir, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: data.id || slug,
      slug,
      title: data.title || 'Untitled',
      tag: data.tag || 'engineering',
      excerpt: data.excerpt || '',
      body: content,
      readTime: data.readTime || calculateReadTime(content),
      views: 0, // You can fetch this from Supabase or an analytics API
      isPublished: data.isPublished !== false,
      publishedAt: data.date || new Date().toISOString(),
      createdAt: data.date || new Date().toISOString(),
      updatedAt: data.date || new Date().toISOString(),
    };
  } catch (err) {
    return null;
  }
}

// Fetch all articles, sorted by date
export async function getArticleList(opts?: {
  tag?: string;
  search?: string;
  limit?: number;
}): Promise<ArticleListItem[]> {
  try {
    const fileNames = fs.readdirSync(contentDir);
    let articles: ArticleListItem[] = [];

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue;
      
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(contentDir, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      if (data.isPublished === false) continue;

      articles.push({
        id: data.id || slug,
        slug,
        title: data.title || 'Untitled',
        tag: data.tag || 'engineering',
        excerpt: data.excerpt || '',
        readTime: data.readTime || calculateReadTime(content),
        views: 0,
        isPublished: true,
        publishedAt: data.date || new Date().toISOString(),
        createdAt: data.date || new Date().toISOString(),
        updatedAt: data.date || new Date().toISOString(),
      });
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (opts?.tag && opts.tag !== 'all') {
      articles = articles.filter(a => a.tag === opts.tag);
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
    // If folder doesn't exist yet, return empty
    return [];
  }
}

// Get all slugs for generateStaticParams
export async function getArticleSlugs(): Promise<string[]> {
  try {
    const fileNames = fs.readdirSync(contentDir);
    return fileNames
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
  } catch (err) {
    return [];
  }
}
