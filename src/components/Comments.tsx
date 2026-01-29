"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommentForm from "@/components/CommentForm";
import CommentContent from "@/components/CommentContent";
import LoginForm from "@/components/LoginForm";
import CommentLogin from "@/components/CommentLogin";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Comment } from "@/app/api/comments/route";
import { MessageSquare, Loader2, LogOut } from "lucide-react";

type CommentsProps = {
  term: string;
};

export default function Comments({ term }: CommentsProps) {
  const { session, isPending, logout } = useAuth();
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
    fetchComments();
  };

  if (loading) {
    return (
      <div className="mt-10 flex w-full items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mt-16 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4"></div>
      <h2 className="flex items-center gap-2 text-xl font-mono font-bold text-gray-900 dark:text-white">        <MessageSquare className="h-5 w-5" />
      <MessageSquare className="h-5 w-5" />
      System Logs <span className="text-gray-400 text-sm font-normal">{comments.length > 0 ? `(${comments.length})` : '(0)'}</span>
            </h2>

      {!isPending && !session ? (
        <div className="mb-12">
          <CommentLogin 
  onLoginClick={() => setLoginOpen(true)}
          />

          <Drawer open={loginOpen} onOpenChange={setLoginOpen}>
            <DrawerContent className="bg-gray-950 border-gray-800 text-gray-200">
              <DrawerHeader>
                <DrawerTitle className="font-mono text-center text-green-500">
                   {">"} AUTHENTICATION_PROTOCOL
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="px-4 pb-8">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        !isPending &&
        session && (
          <div className="mb-12">
            <CommentForm postSlug={term} onCommentAdded={handleCommentAdded} />
          </div>
        )
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/20">
             <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                No logs found in the database. Initialize the conversation.
             </p>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5 backdrop-blur-sm transition-all hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold font-mono text-gray-600 dark:text-gray-300">
                        {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block font-mono font-bold text-sm text-gray-900 dark:text-gray-200">
                        {comment.author}
                      </span>
                      <span className="block text-[10px] text-gray-500 font-mono">
                         ID: {comment.id.substring(0, 8)}
                      </span>
                    </div>
                </div>
                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="pl-11">
                <CommentContent content={comment.content} />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}