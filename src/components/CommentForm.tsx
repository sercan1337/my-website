"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Loader2, MessageSquare } from "lucide-react";

interface CommentFormProps {
  postSlug: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  const { session } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const author = session?.user?.name ?? session?.user?.email ?? "Anonymous";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postSlug,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit comment");
      }

      setContent("");
      onCommentAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Commenting as <span className="font-medium text-gray-900 dark:text-white">{author}</span>
      </p>

      <div>
        <label
          htmlFor="content"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <MessageSquare className="h-4 w-4" />
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={6}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400"
          disabled={isSubmitting}
          required
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {content.length} characters
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">```language</code> for code blocks
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "group inline-flex items-center gap-2 px-6 transition-all duration-200 hover:scale-105 active:scale-95",
            (isSubmitting || !content.trim()) &&
              "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  );
}

