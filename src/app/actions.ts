"use server";

import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function getClaps(slug: string) {
  try {
    const claps = await redis.get<number>(`post:${slug}:claps`);
    return typeof claps === "number" ? claps : 0;
  } catch {
    return 0;
  }
}

export async function incrementClap(slug: string) {
  try {
    await redis.incr(`post:${slug}:claps`);
    revalidatePath(`/blog/${slug}`);
  } catch {
  }
}