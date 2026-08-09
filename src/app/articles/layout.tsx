import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles by Novita (郭瑩慧) on prompt engineering, software engineering, AI, and community events.",
  alternates: { canonical: "https://www.novitaguok.com/articles" },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
