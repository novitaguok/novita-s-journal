import { MetadataRoute } from "next";
import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";

const SITE_URL = "https://www.novitaguok.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guestbook`, changeFrequency: "daily", priority: 0.4 },
  ];

  const useCase = new GetArticlesUseCase();
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await useCase.executeGetSlugs();
    articleRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/articles/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // If listing articles fails (e.g. GitHub API hiccup), still ship static routes.
  }

  return [...staticRoutes, ...articleRoutes];
}
