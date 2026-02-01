"use client";

import { useRef, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";
import CommentLogin from "./CommentLogin";
import CommentForm from "./CommentForm";
import CommentContent, { CommentContentRef } from "./CommentContent";
import { Loader2 } from "lucide-react";

interface CommentsProps {
  slug: string;
}

const emptySubscribe = () => () => {};

export default function Comments({ slug }: CommentsProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { data: session, isPending, refetch } = authClient.useSession();
  const commentContentRef = useRef<CommentContentRef>(null);

  const handleLoginSuccess = () => {
    refetch();
  };

  const handleCommentPosted = () => {
    commentContentRef.current?.refresh();
  };

  const isLoading = !mounted || isPending;

  return (
    <section className="w-full max-w-2xl mx-auto mt-12 mb-20 px-4">
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        <span className="text-xl font-mono font-bold">~/comments</span>
        <span className="animate-pulse text-green-500">_</span>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && !session && (
        <div className="mb-10">
          <CommentLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      )}

      {!isLoading && session && (
        <div className="mb-10">
          <CommentForm user={session.user} slug={slug} onCommentPosted={handleCommentPosted} />
        </div>
      )}

      <CommentContent slug={slug} ref={commentContentRef} />
    </section>
  );
}
