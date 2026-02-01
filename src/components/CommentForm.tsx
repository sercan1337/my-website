"use client";

import { useState } from "react";
import { Send, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Avvvatars from "avvvatars-react";

interface CommentFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  slug: string;
  onCommentPosted?: () => void;
}

export default function CommentForm({ user, slug, onCommentPosted }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment, slug }),
      });

      if (!res.ok) throw new Error("Failed to post");

      setComment("");
      toast.success("COMMENT POSTED", { description: "Your entry has been added to the stream." });
      onCommentPosted?.();
      router.refresh();
    } catch (error) {
      toast.error("ERROR", { description: "Failed to write to database." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Avvvatars value={user.email || user.name || "user"} style="shape" size={32} />
          <div className="flex flex-col">
            <span className="text-sm font-bold font-mono text-gray-900 dark:text-gray-100">
              {user.name || "Anonymous"}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              Authenticated Session
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors font-mono"
        >
          <LogOut size={12} /> EXIT
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Execute write command..."
          className="w-full min-h-[100px] bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 resize-none font-mono"
        />

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold font-mono hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            POST_ENTRY
          </button>
        </div>
      </form>
    </div>
  );
}
