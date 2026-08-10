import { GetArticlesUseCase } from "@/src/use-cases/articles/GetArticlesUseCase";
import { createArticlesRepositories } from "@/src/infrastructure/articles/repositories";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/src/components/BlogPost";

function createUseCase() {
  const { primary, local, github } = createArticlesRepositories();
  return new GetArticlesUseCase(primary, local, github);
}

export async function generateStaticParams() {
  const useCase = createUseCase();
  const slugs = await useCase.executeGetSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = createUseCase();
  const article = await useCase.executeGet(slug);
  if (!article) return {};

  const canonicalUrl = `https://www.novitaguok.com/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      ...(article.updatedAt !== article.publishedAt && {
        modifiedTime: article.updatedAt,
      }),
      authors: ["Novita (郭瑩慧)"],
      siteName: "Novita",
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = createUseCase();
  const article = await useCase.executeGet(slug);
  if (!article) notFound();

  const allArticles = await useCase.executeList();
  const readNextArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return <BlogPost article={article} readNextArticles={readNextArticles} />;
}
