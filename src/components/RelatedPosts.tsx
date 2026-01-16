import Link from "next/link";
import { BlogPost } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

export default function RelatedPosts({
  posts,
  className,
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={cn("border-t border-gray-200 pt-10 dark:border-gray-800", className)}>
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        Related Posts
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

