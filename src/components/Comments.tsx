"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommentForm from "@/components/CommentForm";
import CommentContent from "@/components/CommentContent";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Comment } from "@/app/api/comments/route";
import { MessageSquare, LogIn, Loader2 } from "lucide-react";

type CommentsProps = {
  term: string;
};

export default function Comments({ term }: CommentsProps) {
  const { session, isPending } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(term)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [term]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
  };

  if (loading) {
    return (
      <div className="mt-10 flex w-full items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
        <MessageSquare className="h-5 w-5" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {!isPending && !session ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Log in to leave a comment.
          </p>
          <Drawer open={loginOpen} onOpenChange={setLoginOpen}>
            <DrawerTrigger asChild>
              <Button variant="default" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login to comment
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Sign in or sign up</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        !isPending &&
        session && (
          <div className="mb-8">
            <CommentForm postSlug={term} onCommentAdded={handleCommentAdded} />
          </div>
        )
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-800/30"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <CommentContent content={comment.content} />
            </article>
          ))
        )}
      </div>
    </div>
  );
}
