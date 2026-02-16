"use client";

import { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";
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

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

      toast.success("Entry deleted.", { id: toastId });
      fetchComments(); 
    } catch (error) {
      console.error(error);
      toast.error("Error deleting entry", { id: toastId });
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
      <div className="mt-8 space-y-8 font-mono opacity-50">
         <div className="text-xs text-zinc-500 animate-pulse"> Loading data stream...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-8 font-mono text-xs text-zinc-500 border-l border-zinc-800 pl-4 py-2">
        <p> No entries found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-col font-mono relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {comments.map((comment, index) => {
          const userName = comment.userName || "anonymous";
          const date = new Date(comment.createdAt);
          
          const month = date.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
          const day = date.toLocaleDateString("en-US", { day: "numeric" });
          const timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase();
          
          const isMyComment = session?.user?.id === comment.userId;
          const isLast = index === comments.length - 1;

          return (
            <div key={comment.id} className="group relative pl-6 pb-6">
              {!isLast && (
                 <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
              )}
              
              <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded overflow-hidden opacity-70 grayscale group-hover:grayscale-0 transition-all">
                          <Avvvatars value={userName} style="shape" size={20} />
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                              {userName}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-medium tracking-wider">
                              {month} {day} <span className="text-zinc-300 dark:text-zinc-700">|</span> {timeString}
                          </span>
                      </div>

                      {isMyComment && (
                        <button
                          onClick={() => setDeletingCommentId(comment.id)}
                          className="ml-auto opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all p-1"
                          title="Delete entry"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                  </div>

                  <div className="mt-0.5 relative">
                      <div className="
                        text-sm leading-relaxed text-zinc-700 dark:text-zinc-400
                        bg-zinc-50/50 dark:bg-zinc-900/30
                        border border-zinc-100 dark:border-zinc-800/50
                        rounded-sm px-3 py-2
                      ">
                          <p className="whitespace-pre-wrap break-words">{comment.text}</p>
                      </div>
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

// --- Delete Modal (Minimal Version - Unchanged) ---

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-mono">
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[1px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-black border border-zinc-800 shadow-2xl p-6"
          >
            <div className="flex items-start gap-4 mb-6">
               <div className="text-red-500 mt-1"><AlertTriangle size={20} /></div>
               <div>
                  <h3 className="text-zinc-100 font-bold mb-1">CONFIRM_DELETION</h3>
                  <p className="text-xs text-zinc-500">Irreversible action. Proceed?</p>
               </div>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-colors"
                >
                  DELETE
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body 
  );
};

export default CommentContent;