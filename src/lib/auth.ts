import { betterAuth } from "better-auth";
import { redis } from "@/lib/redis";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  secret: process.env.BETTER_AUTH_SECRET || "change-me-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ...(process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN && {
      secondaryStorage: {
        get: async (key: string) => redis.get(key),
        set: async (key: string, value: string, ttl?: number) => {
          if (ttl) {
            await redis.set(key, value, { ex: ttl });
          } else {
            await redis.set(key, value);
          }
        },
        delete: async (key: string) => {
          await redis.del(key);
        },
      },
    }),
});
