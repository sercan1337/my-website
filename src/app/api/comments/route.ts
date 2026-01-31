import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Better Auth ayarları
import { Redis } from "@upstash/redis"; // Veritabanı

// Redis Bağlantısı
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// --- YORUM EKLEME (POST) ---
export async function POST(req: Request) {
  try {
    // 1. Oturum Kontrolü (Giriş yapmamışsa yorum atamaz)
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    }

    // 2. Veriyi Al
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Yorum boş olamaz." }, { status: 400 });
    }

    // 3. Yorum Objesini Oluştur
    const newComment = {
      id: crypto.randomUUID(),
      text: text.trim(),
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image, // Avatar varsa
      createdAt: new Date().toISOString(),
    };

    // 4. Redis'e Kaydet (Listeye ekle: En başa ekler)
    // "site_comments" anahtarlı bir listeye ekliyoruz.
    await redis.lpush("site_comments", JSON.stringify(newComment));

    return NextResponse.json({ success: true, comment: newComment });

  } catch (error) {
    console.error("Yorum hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

// --- YORUMLARI GETİRME (GET) ---
// Yorumları sayfada listelemek için buna da ihtiyacın olacak
export async function GET() {
  try {
    // Redis listesinden hepsini çek (0'dan -1'e kadar yani hepsi)
    const commentsData = await redis.lrange("site_comments", 0, -1);

    // Redis string olarak tuttuğu için JSON'a çeviriyoruz
    const comments = commentsData.map((item: string) => JSON.parse(item));

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Yorumlar yüklenemedi" }, { status: 500 });
  }
}