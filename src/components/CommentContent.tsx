"use client";

import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Terminal, Trash2, AlertTriangle, X } from "lucide-react";
import Avvvatars from "avvvatars-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  
  const { data: session } = authClient.useSession(); 

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

  const confirmDelete = async () => {
    if (!deletingCommentId) return;

    const toastId = toast.loading("Executing delete command...");
    
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingCommentId, slug }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
      }

      toast.success("Comment deleted successfully.", { id: toastId });
      fetchComments(); 

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error deleting comment", { id: toastId });
    } finally {
      setDeletingCommentId(null); 
    }
  };

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
    <>
      <div className="mt-8 space-y-8 font-mono relative">
        {comments.map((comment) => {
          const userName = comment.userName || "anonymous";
          const date = new Date(comment.createdAt);
          const timeString = date.toLocaleTimeString("en-EN", { hour: "2-digit", minute: "2-digit" });
          const dateString = date.toLocaleDateString("en-EN", { day: "numeric", month: "short" });
          
          const isMyComment = session?.user?.id === comment.userId;

          return (
            <div key={comment.id} className="group relative pl-6 border-l border-zinc-300 dark:border-zinc-800 transition-colors">
              
              <div className="
                absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full transition-all duration-300
                bg-white border border-white shadow-[0_0_8px_rgba(66,207,142,0.4)]
                group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(66,207,142,0.6)]
              " />

              <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="opacity-90 group-hover:opacity-100 transition-opacity filter drop-shadow-sm">
                              <Avvvatars value={userName} style="shape" size={28} />
                          </div>
                          <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 group-hover:text-[#42CF8E] dark:group-hover:text-white-800 transition-colors duration-300 leading-none tracking-tight">
                                  {userName}
                              </span>
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                                  {dateString} <span className="opacity-40 mx-1">|</span> {timeString}
                              </span>
                          </div>
                      </div>

                      {isMyComment && (
                        <button
                          onClick={() => setDeletingCommentId(comment.id)}
                          className="
                            opacity-0 group-hover:opacity-100 transition-all duration-200
                            text-zinc-400 hover:text-red-500 p-1.5 rounded-md
                            hover:bg-red-50 dark:hover:bg-red-900/20
                          "
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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
      
      <DeleteModal 
        isOpen={!!deletingCommentId}
        onClose={() => setDeletingCommentId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
});

CommentContent.displayName = "CommentContent";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
          />
          
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="
                pointer-events-auto w-full max-w-sm 
                bg-white dark:bg-zinc-950
                border border-zinc-200 dark:border-zinc-800 
                rounded-xl shadow-2xl overflow-hidden font-mono
              "
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  CONFIRM_DELETION
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to execute this action? This process cannot be undone.
                </p>
              </div>

              <div className="flex border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <button
                  onClick={onClose}
                  className="
                    flex-1 py-4 text-sm font-bold 
                    text-zinc-600 dark:text-zinc-400  
                    hover:bg-[#42CF8E] hover:text-white
                    dark:hover:bg-zinc-900 dark:hover:text-zinc-300
                    transition-colors duration-200
                    border-r border-zinc-200 dark:border-zinc-800
                  "
                >
                  CANCEL
                </button>
                <button
                  onClick={onConfirm}
                  className="
                    flex-1 py-4 text-sm font-bold text-red-600 dark:text-red-500 
                    hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                    flex items-center justify-center gap-2
                  "
                >
                  <Trash2 size={16} />
                  DELETE_ENTRY
                </button>
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body 
  );
};

export default CommentContent;