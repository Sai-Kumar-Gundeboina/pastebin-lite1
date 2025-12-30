import { NextResponse } from "next/server";
import { redis } from "@/lib/db";
import { now } from "@/lib/time";
import { nanoid } from "nanoid";

type Paste = {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  views_used: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Validate content
    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    // 2️⃣ Validate optional fields
    const ttlSeconds =
      body.ttl_seconds !== undefined
        ? Number(body.ttl_seconds)
        : null;

    const maxViews =
      body.max_views !== undefined
        ? Number(body.max_views)
        : null;

    if (ttlSeconds !== null && ttlSeconds <= 0) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 }
      );
    }

    if (maxViews !== null && maxViews <= 0) {
      return NextResponse.json(
        { error: "Invalid max_views" },
        { status: 400 }
      );
    }

    // 3️⃣ Create paste
    const id = nanoid(8);
    const createdAt = await now();

    const paste: Paste = {
      id,
      content: body.content,
      created_at: createdAt,
      expires_at:
        ttlSeconds !== null ? createdAt + ttlSeconds * 1000 : null,
      max_views: maxViews,
      views_used: 0,
    };

    // 4️⃣ Save to Redis
    await redis.set(`paste:${id}`, paste);

    // 5️⃣ Return response
    return NextResponse.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
