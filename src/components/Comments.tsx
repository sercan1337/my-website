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
    <section className="comments-sys w-full max-w-3xl mx-auto mt-12 mb-20">

      {isLoading && (
        <div className="comments-sys-loading">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && !session && (
        <div className="mb-5">
          <CommentLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      )}

      {!isLoading && session && (
        <div className="mb-5">
          <CommentForm user={session.user} slug={slug} onCommentPosted={handleCommentPosted} />
        </div>
      )}

      <CommentContent slug={slug} ref={commentContentRef} />
    </section>
  );
}
