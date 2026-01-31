"use client";

import { useEffect, useState } from "react";
import { Terminal, Clock, User } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  createdAt: string;
}

export default function CommentContent() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Yorumları API'den Çek
  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Yorumlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Yorum atılınca listeyi güncellemek için bir event listener dinleyebiliriz
    // veya basitçe her 10 saniyede bir güncelleyebiliriz (Polling)
    const interval = setInterval(fetchComments, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-12 text-center text-gray-400 font-mono text-sm border border-dashed border-gray-300 dark:border-gray-800 p-8 rounded-lg">
        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No entries found in log.</p>
        <p className="text-xs mt-1">Be the first to initialize the stream.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-800 hover:border-green-500 transition-colors duration-300"
        >
          {/* Header: İsim ve Tarih */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 dark:text-green-400 font-mono font-bold text-sm">
              root@{comment.userName?.toLowerCase().replace(/\s+/g, '') || "anon"}:~#
            </span>
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Clock size={10} />
              {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>

          {/* Yorum Metni */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg rounded-tl-none font-mono text-sm text-gray-700 dark:text-gray-300 shadow-sm">
             <p className="whitespace-pre-wrap break-words">{comment.text}</p>
          </div>

          {/* Süsleme: Yanıp sönen imleç efekti (Sadece en yeni yorumda) */}
          {comments.indexOf(comment) === 0 && (
            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
          )}
        </div>
      ))}
    </div>
  );
}