import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const CACHE_TAG_ALL = "articles";
const cacheTagFor = (slug: string) => `article-${slug}`;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] REVALIDATE_SECRET env var is not set.");
    return false;
  }
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { revalidated: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: { slug?: string; revalidateAll?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { revalidated: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { slug, revalidateAll } = body;

  if (!slug && !revalidateAll) {
    return NextResponse.json(
      { revalidated: false, error: "Provide either 'slug' or 'revalidateAll: true'" },
      { status: 400 }
    );
  }

  // Cache profile: re-fetched content lives for 1 hour before the next
  // automatic stale check. The webhook will bust it sooner on article updates.
  const cacheProfile = { expire: 3600 };

  if (revalidateAll) {
    revalidateTag(CACHE_TAG_ALL, cacheProfile);
    revalidatePath("/articles", "layout");
    revalidatePath("/", "page"); // homepage may show recent articles
    return NextResponse.json({ revalidated: true, scope: "all", at: new Date().toISOString() });
  }

  // Revalidate a single article and the list page
  revalidateTag(cacheTagFor(slug!), cacheProfile);
  revalidateTag(CACHE_TAG_ALL, cacheProfile);
  revalidatePath(`/articles/${slug}`, "page");
  revalidatePath("/articles", "page");
  revalidatePath("/", "page");

  return NextResponse.json({
    revalidated: true,
    slug,
    at: new Date().toISOString(),
  });
}
