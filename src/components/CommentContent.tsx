"use client";

import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Terminal } from "lucide-react";
import Avvvatars from "avvvatars-react";

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

interface CommentContentProps {
  slug: string;
}

export interface CommentContentRef {
  refresh: () => void;
}

const CommentContent = forwardRef<CommentContentRef, CommentContentProps>(({ slug }, ref) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useImperativeHandle(ref, () => ({
    refresh: fetchComments,
  }));

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [fetchComments]);

  if (loading) {
    return (
      <div className="mt-8 space-y-4 font-mono">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start animate-pulse">
            <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded mt-1" />
            <div className="space-y-2 flex-1">
                <div className="h-3 bg-zinc-300 dark:bg-zinc-900 rounded w-1/4" />
                <div className="h-10 bg-zinc-100 dark:bg-zinc-900/50 rounded w-full border border-zinc-200 dark:border-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-12 text-center text-zinc-500 dark:text-zinc-400 font-mono text-xs border border-dashed border-zinc-300 dark:border-zinc-800 p-8 rounded bg-zinc-50 dark:bg-zinc-950/30">
        <Terminal className="w-6 h-6 mx-auto mb-3 opacity-30" />
        <p>[LOG_EMPTY]: No comments found.</p>
        <p className="mt-1 opacity-50">Be the first to execute a write operation.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8 font-mono">
      {comments.map((comment) => {
        const userName = comment.userName || "anonymous";
        const date = new Date(comment.createdAt);
        const timeString = date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" });
        const dateString = date.toLocaleDateString("en-EN", { day: "numeric", month: "short" });

        return (
          <div key={comment.id} className="group relative pl-6 border-l border-zinc-300 dark:border-zinc-800 transition-colors">
            
            <div className="
              absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full transition-all duration-300
              bg-white border border-white shadow-[0_0_8px_rgba(66,207,142,0.4)]
              group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(66,207,142,0.6)]
            " />

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="opacity-90 group-hover:opacity-100 transition-opacity filter drop-shadow-sm">
                        <Avvvatars value={userName} style="shape" size={28} />
                    </div>
                    <div className="flex flex-col">
                         <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 group-hover:text-[#42CF8E] transition-colors duration-300 leading-none tracking-tight">
                            {userName}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                            {dateString} <span className="opacity-40 mx-1">|</span> {timeString}
                        </span>
                    </div>
                </div>

                <div className="
                  mt-1 p-4 rounded-lg text-sm leading-relaxed transition-all duration-300
                  bg-white border border-zinc-200 shadow-sm text-zinc-700 
                  hover:border-[#42CF8E]/50 dark:hover:border-zinc-700   hover:shadow-md
                  
                  dark:bg-zinc-900/30 dark:border-zinc-800/50 dark:text-zinc-400 
                  dark:shadow-none dark:hover:border-[#42CF8E]/40
                ">
                    <p className="whitespace-pre-wrap break-words">{comment.text}</p>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

CommentContent.displayName = "CommentContent";

export default CommentContent;