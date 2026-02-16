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
      toast.success("ENTRY ADDED", { description: "Write operation successful." });
      onCommentPosted?.();
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error("EXECUTION FAILED", { description: "Could not write to stream." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <div className="w-full mb-12 font-mono">
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          ~/comments 
          <span className="text-zinc-400 dark:text-white">_</span>
        </h3>
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 mt-4" />
      </div>

      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="opacity-90 grayscale hover:grayscale-0 transition-all duration-300">
            <Avvvatars value={user.email || user.name || "user"} style="shape" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 leading-none">
              {user.name || "Anonymous"}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1.5 tracking-wide">
              Writing as authenticated user
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" /> 
          LOGOUT
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Execute write command..."
            className="
              w-full min-h-[140px]
              bg-zinc-50 dark:bg-black
              border border-zinc-300 dark:border-zinc-800
              rounded-xl p-5 text-sm 
              focus:outline-none 
              focus:border-[#42CF8E] dark:focus:border-zinc-700
              resize-none 
              text-zinc-800 dark:text-zinc-300 
              placeholder:text-zinc-400 dark:placeholder:text-zinc-600 
              transition-all duration-300
            "
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading || !comment.trim()}
            className="
              flex items-center gap-2 px-5 py-2.5 
              text-zinc-900 dark:text-zinc-300 
              rounded-lg text-xs font-bold tracking-wider
              hover:bg-zinc-300/25 dark:hover:bg-zinc-700/30 hover:text-black dark:hover:text-white
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-200
            "
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            POST_ENTRY
          </button>
        </div>
      </form>
    </div>
  );
}