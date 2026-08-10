/**
 * Pure markdown heading utilities shared between the article renderer and the
 * table of contents. Kept free of DOM/React dependencies so both layers can
 * derive consistent heading ids from the same source of truth.
 */

export interface MarkdownHeading {
  id: string;
  text: string;
  level: number;
}

const HEADING_RE = /^(#{2,3})\s+(.+)$/gm;
const INLINE_MARKUP_RE = /[*_~`]/g;
const HEADING_SELECTOR = "h2[id], h3[id]";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Plain text of a heading's rendered children (handles inline elements). */
export function headingText(children: unknown): string {
  return nodeToText(children).replace(/\s+/g, " ").trim();
}

function nodeToText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as { props: { children?: unknown } }).props.children);
  }
  return "";
}

/** Parse h2/h3 headings out of raw markdown, without a DOM. */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const items: MarkdownHeading[] = [];
  let match: RegExpExecArray | null;
  while ((match = HEADING_RE.exec(markdown)) !== null) {
    const level = match[1].length;
    const cleanText = match[2].replace(INLINE_MARKUP_RE, "").trim();
    const id = slugify(cleanText);
    if (id && cleanText) {
      items.push({ id, text: cleanText, level });
    }
  }
  return items;
}

/** All rendered headings, in document order. */
export function getRenderedHeadings(): Array<{ id: string; text: string; level: number }> {
  return Array.from(document.querySelectorAll(HEADING_SELECTOR)).map((el) => ({
    id: el.id,
    text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
    level: el.tagName === "H2" ? 2 : 3,
  }));
}
