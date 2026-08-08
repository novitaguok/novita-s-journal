"use client";

import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  style?: React.CSSProperties;
}

export function Breadcrumbs({ items, style = {} }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.4rem",
        fontFamily: "var(--f-mono)",
        fontSize: "0.68rem",
        color: "var(--ink-faint)",
        marginBottom: "1.25rem",
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span style={{ opacity: 0.5, userSelect: "none" }}>&gt;</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={{
                  color: "var(--ink-faint)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink-faint)")
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  color: isLast ? "var(--ink)" : "var(--ink-faint)",
                  fontWeight: isLast ? 600 : 400,
                  maxWidth: isLast ? "300px" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
