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
      console.error(error);
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
    <div className="w-full mb-10">
      
      <div className="flex justify-between items-end mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="ring-1 ring-gray-200 dark:ring-gray-700 rounded-full p-0.5">
            <Avvvatars value={user.email || user.name || "user"} style="shape" size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold font-mono text-gray-900 dark:text-gray-200 leading-none">
              {user.name || "Anonymous"}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-500 font-mono mt-1">
              Writing as authenticated user
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-[10px] uppercase tracking-wider flex items-center gap-1.5 text-red-500 hover:text-red-600 dark:text-red-500/80 dark:hover:text-red-400 transition-all font-mono hover:-translate-y-0.5 py-1 px-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut size={10} /> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Execute write command..."
          className="
            w-full min-h-[100px]
            bg-white
            dark:bg-[#09090b]
            border border-gray-200 
            dark:border-gray-700/80
            rounded-xl p-4 text-sm 
            focus:outline-none 
            focus:ring-0
            focus:border-[#42CF8E] dark:focus:border-gray-500
            resize-none font-mono 
            text-gray-900 dark:text-gray-300 
            placeholder:text-gray-400 dark:placeholder:text-gray-600 
            transition-all shadow-sm
            hover:border-gray-600/50 dark:hover:border-gray-600
          "
        />

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 dark:bg-white/80 text-white dark:text-black rounded-lg text-xs font-bold font-mono hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            POST_ENTRY
          </button>
        </div>
      </form>
    </div>
  );
}