import { MetadataRoute } from "next";
import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";
import { createArticlesRepositories } from "@/src/infrastructure/articles/repositories";

const SITE_URL = "https://www.novitaguok.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guestbook`, changeFrequency: "daily", priority: 0.4 },
  ];

  try {
    const { primary, local, github } = createArticlesRepositories();
    const useCase = new GetArticlesUseCase(primary, local, github);
    const slugs = await useCase.executeGetSlugs();
    const articleRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${SITE_URL}/articles/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    return [...staticRoutes, ...articleRoutes];
  } catch {
    // If listing articles fails (e.g. GitHub API hiccup), still ship static routes.
    return staticRoutes;
  }
}
