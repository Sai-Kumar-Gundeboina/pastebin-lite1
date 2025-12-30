import { NextResponse } from "next/server";
import { redis } from "@/lib/db";
import { now } from "@/lib/time";

type Paste = {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  views_used: number;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  // 1️⃣ Fetch paste
  const paste = (await redis.get(key)) as Paste | null;

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = await now();

  // 2️⃣ Check expiry
  if (paste.expires_at !== null && currentTime >= paste.expires_at) {
    await redis.del(key);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 3️⃣ Check view limit
  if (
    paste.max_views !== null &&
    paste.views_used >= paste.max_views
  ) {
    await redis.del(key);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4️⃣ Increment views
  paste.views_used += 1;
  await redis.set(key, paste);

  // 5️⃣ Prepare response
  const remainingViews =
    paste.max_views !== null
      ? paste.max_views - paste.views_used
      : null;

  return NextResponse.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
