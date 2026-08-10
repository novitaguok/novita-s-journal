"use client";

import { useEffect, useMemo, useState } from "react";
import {
  extractHeadings,
  getRenderedHeadings,
  MarkdownHeading,
} from "@/src/lib/markdown";

export interface TableOfContentsEntry extends MarkdownHeading {
  /** id of the rendered heading; falls back to the markdown-derived slug. */
  targetId: string;
}

const ACTIVE_HEADING_OFFSET = 120; // sticky header + breathing room
const HEADING_SELECTOR = "h2[id], h3[id]";

function getHeadingElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll(HEADING_SELECTOR));
}

export function useTableOfContents(markdown: string) {
  // Derived from raw markdown so the TOC renders before the article body does.
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  const [activeId, setActiveId] = useState<string>("");

  // The rendered DOM is the source of truth for ids and the scroll position.
  // The markdown-derived list may differ (e.g. headings with inline markup),
  // so reconcile each entry to the heading actually rendered.
  const entries: TableOfContentsEntry[] = useMemo(() => {
    if (typeof document === "undefined") {
      return headings.map((h) => ({ ...h, targetId: h.id }));
    }
    const rendered = getRenderedHeadings();
    return headings.map((h) => {
      const match = rendered.find((r) => r.text === h.text);
      return { ...h, targetId: match?.id ?? h.id };
    });
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;

    const onScroll = () => {
      let currentId = "";
      for (const el of getHeadingElements()) {
        if (el.getBoundingClientRect().top - ACTIVE_HEADING_OFFSET <= 0) {
          currentId = el.id;
        }
      }
      setActiveId(currentId);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings.length]);

  return { entries, activeId, setActiveId };
}
