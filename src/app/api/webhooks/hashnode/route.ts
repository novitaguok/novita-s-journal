import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SyncHashnodeArticleUseCase } from "@/src/use-cases/articles/SyncHashnodeArticleUseCase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hashnode-signature");
    const secret = process.env.HASHNODE_WEBHOOK_SECRET;

    // Verify signature if secret is configured in environment
    if (secret) {
      if (!signature) {
        return NextResponse.json({ error: "Missing x-hashnode-signature header" }, { status: 401 });
      }
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      );

      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.data?.eventType;
    const postId = payload.data?.post?.id;

    if (!postId) {
      return NextResponse.json({ error: "Missing post ID in webhook payload" }, { status: 400 });
    }

    // Only process published or updated events
    if (eventType === "post_published" || eventType === "post_updated") {
      const useCase = new SyncHashnodeArticleUseCase();
      await useCase.execute(postId);
      return NextResponse.json({ message: "Article synchronized successfully", postId });
    }

    return NextResponse.json({ message: `Skipped event type: ${eventType}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
