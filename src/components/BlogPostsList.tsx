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
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        .animate-grid {
          animation: grid-move 3s linear infinite;
        }
      `}} />

      <div className="min-h-screen w-full relative bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
            animate-grid"
            style={{ backgroundSize: '30px 30px' }}>
          </div>
          <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,transparent_20%,black)] dark:bg-gray-950"></div>
        </div>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 sm:px-8">
          <div className="flex flex-col items-start mb-16 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Writing on software, design, and what I&apos;m learning.
            </p>
          </div>

          <div className="flex flex-col space-y-8">
            {sortedPosts.map((post) => {
              const readingTime = calculateReadingTime(post.content || "");
              return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="flex flex-col space-y-3 py-4 border-b border-gray-200/30 dark:border-gray-800/30 transition-colors duration-300">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center text-sm font-mono text-gray-400 dark:text-gray-500 space-x-2">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{readingTime}</span>
                  </div>
                </article>
              </Link>
            )})}
          </div>
        </main>
      </div>
    </>
  );
}