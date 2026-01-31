"use client";

import { authClient } from "@/lib/auth-client"; // Better Auth Client
import CommentLogin from "./CommentLogin";
import CommentForm from "./CommentForm";
import CommentContent from "./CommentContent"; // Yorumları listeleyen bileşen
import { Loader2 } from "lucide-react";

export default function Comments() {
  // Better Auth'un kendi hook'u ile oturumu canlı takip ediyoruz
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="w-full max-w-2xl mx-auto mt-12 mb-20 px-4">
      
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        <span className="text-xl font-mono font-bold">~/comments</span>
        <span className="animate-pulse text-green-500">_</span>
      </div>

      {/* 1. DURUM: Yükleniyor (Session kontrol ediliyor) */}
      {isPending && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* 2. DURUM: Giriş Yapılmamış -> LOGIN GÖSTER */}
      {!isPending && !session && (
        <div className="mb-10">
          <CommentLogin />
        </div>
      )}

      {/* 3. DURUM: Giriş Yapılmış -> FORM GÖSTER */}
      {!isPending && session && (
        <div className="mb-10">
            {/* Kullanıcı bilgisini forma gönderiyoruz */}
           <CommentForm user={session.user} />
        </div>
      )}

      {/* Her durumda yorum listesini göster */}
      <CommentContent />

    </section>
  );
}