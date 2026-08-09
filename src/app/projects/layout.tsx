import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Novita (郭瑩慧) — open source and personal work in software engineering.",
  alternates: { canonical: "https://www.novitaguok.com/projects" },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
