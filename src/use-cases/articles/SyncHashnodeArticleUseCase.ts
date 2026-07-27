import { ArticlesRepository } from "../../domain/articles/repository";
import { SupabaseArticlesRepository } from "../../infrastructure/articles/SupabaseArticlesRepository";

export class SyncHashnodeArticleUseCase {
  constructor(
    private dbRepo: ArticlesRepository = new SupabaseArticlesRepository()
  ) {}

  async execute(postId: string): Promise<void> {
    const GQL_ENDPOINT = "https://gql.hashnode.com";
    const query = `
      query GetPostById($id: ID!) {
        post(id: $id) {
          id
          title
          slug
          brief
          publishedAt
          content {
            markdown
          }
          tags {
            slug
          }
        }
      }
    `;

    const res = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: postId },
      }),
    });

    if (!res.ok) {
      throw new Error(`Hashnode API request failed: ${res.statusText}`);
    }

    const { data, errors } = await res.json();
    if (errors && errors.length > 0) {
      throw new Error(`Hashnode GraphQL error: ${errors[0].message}`);
    }

    const post = data?.post;
    if (!post) {
      throw new Error(`Post not found on Hashnode: ${postId}`);
    }

    const tag = post.tags?.[0]?.slug || "engineering";
    const body = post.content?.markdown || "";
    
    // Estimate read time (words / 200)
    const wordsCount = body.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordsCount / 200) || 1;

    await this.dbRepo.upsertArticle({
      id: post.id,
      slug: post.slug,
      title: post.title || "Untitled",
      tag,
      excerpt: post.brief || "",
      body,
      readTime,
      views: 0,
      isPublished: true,
      publishedAt: post.publishedAt || new Date().toISOString(),
      createdAt: post.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
