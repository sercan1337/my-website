"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/posts";
import { Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";
import { PopularPostsSkeleton } from "@/components/Skeleton";

interface PopularPostsProps {
  limit?: number;
  className?: string;
}

export default function PopularPosts({
  limit = 5,
  className = "",
}: PopularPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(
          `/api/analytics/popular?limit=${limit}`
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Popular Posts
        </h2>
        <PopularPostsSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Popular Posts
      </h2>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {index + 1}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {post.title}
                  </h3>
                </div>
                {post.excerpt && (
                  <p className="mb-2 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTime(post.content)} min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

