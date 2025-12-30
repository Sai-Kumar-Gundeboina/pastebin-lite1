import { headers } from "next/headers";

export async function now(): Promise<number> {
  const testMode = process.env.TEST_MODE === "1";

  if (testMode) {
    const h = await headers();
    const testNow = h.get("x-test-now-ms");
    if (testNow) {
      return Number(testNow);
    }
  }

  return Date.now();
}
