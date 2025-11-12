"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCountProps {
  slug: string;
  className?: string;
  showIcon?: boolean;
}

export default function ViewCount({
  slug,
  className = "",
  showIcon = true,
}: ViewCountProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await fetch(
          `/api/analytics/view?slug=${encodeURIComponent(slug)}`
        );
        if (response.ok) {
          const data = await response.json();
          setViewCount(data.viewCount);
        }
      } catch (error) {
        console.error("Error fetching view count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewCount();
  }, [slug]);

  if (isLoading) {
    return (
      <span className={`inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        {showIcon && <Eye className="h-4 w-4" />}
        <span>...</span>
      </span>
    );
  }

  if (viewCount === null || viewCount === 0) {
    return null;
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {showIcon && <Eye className="h-4 w-4" />}
      <span>
        {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
      </span>
    </span>
  );
}

