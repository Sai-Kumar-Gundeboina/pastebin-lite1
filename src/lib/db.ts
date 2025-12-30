import { Redis } from "@upstash/redis";

console.log("UPSTASH URL =", process.env.UPSTASH_REDIS_REST_URL);

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
