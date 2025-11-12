"use client";

import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentContent from "./CommentContent";
import { MessageSquare, Loader2 } from "lucide-react";

interface CommentsProps {
  term: string; // Post slug
}

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

// Helper function to get user avatar initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to get relative time
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Comments({ term }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [term]);

  return (
    <div id="comments-section" className="mt-16">
      {/* Header */}
      <div className="mb-8 border-t border-gray-200 pt-8 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              Comments
              {comments.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {comments.length}
                </span>
              )}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join the conversation and share your thoughts.
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Leave a Comment
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your email address will not be published. Required fields are marked.
          </p>
        </div>
        <CommentForm postSlug={term} onCommentAdded={fetchComments} />
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-800">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              Loading comments...
            </span>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-medium">Error loading comments</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white py-16 text-center dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-base font-medium text-gray-600 dark:text-gray-400">
              No comments yet
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/50">
                  {getInitials(comment.author)}
                </div>

                {/* Comment Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <CommentContent content={comment.content} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
