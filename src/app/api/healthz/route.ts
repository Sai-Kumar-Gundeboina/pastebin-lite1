import { redis } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await redis.set("health_check", "ok");
  return NextResponse.json({ ok: true });
}
