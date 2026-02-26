import { incrementViews } from "@/src/lib/supabase";
import { getArticle, getArticleSlugs } from "@/src/lib/articles-local";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock, Rule, TagBadge } from "../../../components/Shared";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import GiscusClient from "../../../components/GiscusClient";
import ArticleLayoutWrapper from "../../../components/ArticleLayoutWrapper";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

const mdComponents: Components = {
  h2: ({ children }) => (
    <h2
      style={{
        fontFamily: "var(--f-display)",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "var(--ink)",
        letterSpacing: "-0.02em",
        margin: "2.5rem 0 0.75rem",
        paddingBottom: "0.4rem",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontFamily: "var(--f-display)",
        fontSize: "1.15rem",
        fontWeight: 700,
        color: "var(--ink)",
        margin: "1.75rem 0 0.5rem",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      style={{
        fontFamily: "var(--f-display)",
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--ink)",
        margin: "1.5rem 0 0.4rem",
      }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p
      style={{
        fontFamily: "var(--f-body)",
        fontSize: "1rem",
        lineHeight: 1.85,
        color: "var(--ink-soft)",
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </p>
  ),

  // Code — inline vs block
  code: ({ node, className, children, ...props }) => {
    const isBlock = !!className; // react-markdown sets className="language-xxx" on fenced blocks
    const lang = className?.replace("language-", "") ?? "ts";
    const code = String(children).replace(/\n$/, "");

    if (isBlock) {
      return (
        <CodeBlock code={code} lang={lang} style={{ margin: "1.5rem 0" }} />
      );
    }

    // Inline code
    return (
      <code
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: "0.82em",
          background: "var(--canvas-code)",
          border: "1px solid var(--rule)",
          borderRadius: "4px",
          padding: "0.1em 0.35em",
          color: "var(--tok-kw)",
        }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "var(--accent)",
        textDecoration: "underline",
        textDecorationColor: "rgba(9,105,218,0.3)",
        textUnderlineOffset: "3px",
      }}
    >
      {children}
    </a>
  ),

  // Text style
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700, color: "var(--ink)" }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
      {children}
    </em>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "3px solid var(--rule-dark)",
        paddingLeft: "1.25rem",
        margin: "1.5rem 0",
        color: "var(--ink-faint)",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),

  // Lists
  ul: ({ children }) => (
    <ul
      style={{
        fontFamily: "var(--f-body)",
        fontSize: "1rem",
        lineHeight: 1.85,
        color: "var(--ink-soft)",
        paddingLeft: "1.5rem",
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        fontFamily: "var(--f-body)",
        fontSize: "1rem",
        lineHeight: 1.85,
        color: "var(--ink-soft)",
        paddingLeft: "1.5rem",
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: "0.35rem" }}>{children}</li>,

  // Horizontal rule
  hr: () => (
    <div style={{ height: 1, background: "var(--rule)", margin: "2rem 0" }} />
  ),

  // Tables (via remark-gfm)
  table: ({ children }) => (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--f-mono)",
          fontSize: "0.8rem",
        }}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ borderBottom: "2px solid var(--rule-dark)" }}>
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th
      style={{
        padding: "0.5rem 0.75rem",
        textAlign: "left",
        color: "var(--ink)",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "0.5rem 0.75rem",
        color: "var(--ink-soft)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {children}
    </td>
  ),

  // Images
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      style={{
        maxWidth: "100%",
        borderRadius: 8,
        border: "1px solid var(--rule)",
        margin: "1.5rem 0",
        display: "block",
      }}
    />
  ),
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  incrementViews(slug).catch(() => {});

  return (
    <article style={{ paddingTop: "52px", minHeight: "100vh" }}>
      <ArticleLayoutWrapper>
        <Link
          href="/articles"
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "0.68rem",
            color: "var(--ink-faint)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
        >
          ← writing/
        </Link>

        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            <TagBadge tag={article.tag} />
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
              }}
            >
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
                marginLeft: "auto",
              }}
            >
              {article.readTime} min read
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>

          <p
            style={{
              fontFamily: "var(--f-body)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--ink-faint)",
              fontStyle: "italic",
            }}
          >
            {article.excerpt}
          </p>
        </div>

        <Rule style={{ marginBottom: "2.5rem" }} />

        {/* Body — rendered by react-markdown */}
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {article.body}
        </ReactMarkdown>

        <Rule style={{ margin: "3rem 0 2rem" }} />

        {/* Comments Section */}
        <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
          <GiscusClient
            id="comments"
            repo="novitaguok/novita-s-journal"
            repoId="R_kgDOMP_xxx"
            category="Announcements"
            categoryId="DIC_kwDOMP_xxx"
            mapping="pathname"
            term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
            loading="lazy"
          />
        </div>

        {/* Footer meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link
            href="/articles"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.68rem",
              color: "var(--ink-faint)",
              textDecoration: "none",
            }}
          >
            ← back to all articles
          </Link>
        </div>
      </ArticleLayoutWrapper>
    </article>
  );
}
