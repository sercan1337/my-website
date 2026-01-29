import { betterAuth } from "better-auth";
import { redis } from "@/lib/redis"; 

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  secondaryStorage: {
    get: async (key: string) => {
      return await redis.get(key);
    },
    set: async (key: string, value: string, ttl?: number) => {
      await redis.set(key, value);
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  },
  user: {
    additionalFields: {
      nickname: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
});
