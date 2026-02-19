"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/posts";

const calculateReadingTime = (text: string): string => {
  if (!text) return "3 min read";
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen w-full relative">

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 sm:px-8">
        <div className="flex flex-col items-start mb-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-bold">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Writing on software, design, and what I&apos;m learning.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          {sortedPosts.map((post) => {
            const readingTime = calculateReadingTime(post.content || "");
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative block p-6 -mx-6 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-[#42CF8E] to-[#2ecc71] dark:from-[#ffffff] dark:to-[#e3e3e3] rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                <article className="flex flex-col space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#42CF8E] transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm font-mono text-gray-400 dark:text-gray-500 space-x-2 pt-1">
                  <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).toLowerCase()}
                      </time>
                    <span>·</span>
                    <span>{readingTime}</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}