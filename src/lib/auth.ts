import { betterAuth } from "better-auth";
import { redis } from "@/lib/redis"; 

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // BU KISIM ŞART: Bu fonksiyon yoksa client'ta forgetPassword metodu gözükmez.
    sendResetPassword: async ({ user, url }) => {
      // E-posta gönderim mantığı buraya gelecek (Resend, Nodemailer vb.)
      console.log(`Şifre sıfırlama bağlantısı (${user.email}): ${url}`);
    },
  },
  secondaryStorage: {
    get: async (key: string) => {
      return await redis.get(key);
    },
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
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
});