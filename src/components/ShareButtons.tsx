"use client";

import { useState, useEffect } from "react";
import { Share2, Linkedin, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";

// X (Twitter) Logo SVG Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

export default function ShareButtons({
  title,
  url,
  className,
}: ShareButtonsProps) {
  const { showToast } = useToast();
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  const [fullUrl, setFullUrl] = useState(url);

  // Set full URL and check native share availability on client side only
  useEffect(() => {
    setFullUrl(window.location.href);
    setCanUseNativeShare("share" in navigator);
  }, []);

  const shareData = {
    title,
    url: fullUrl,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent(title);
    const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast("Link copied to clipboard", "success", 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy link", "error", 3000);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        
      </span>
      {canUseNativeShare && (
        <button
          onClick={handleShare}
          className="group flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span>Share</span>
        </button>
      )}
      <button
        onClick={shareToX}
        className="group flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-lg active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900"
        aria-label="Share on X"
      >
        <XIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
        <span>X</span>
      </button>
      <button
        onClick={shareToLinkedIn}
        className="group flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:scale-105 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-blue-500"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
        <span>LinkedIn</span>
      </button>
      <button
        onClick={copyToClipboard}
        className="group flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:scale-105 hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-md active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
        aria-label="Copy link"
      >
        <Link2 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
        <span>Copy</span>
      </button>
    </div>
  );
}

