"use client";

import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Terminal, Clock } from "lucide-react";
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
      if (!res.ok) return;
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments");
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
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-800 hover:border-green-500 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <Avvvatars value={comment.userName || "anon"} style="shape" size={20} />
            <span className="text-green-600 dark:text-green-400 font-mono font-bold text-sm">
              {comment.userName || "anon"}
            </span>
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Clock size={10} />
              {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg rounded-tl-none font-mono text-sm text-gray-700 dark:text-gray-300 shadow-sm">
            <p className="whitespace-pre-wrap break-words">{comment.text}</p>
          </div>

          {index === 0 && (
            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
          )}
        </div>
      ))}
    </div>
  );
});

CommentContent.displayName = "CommentContent";

export default CommentContent;
