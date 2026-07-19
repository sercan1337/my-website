"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import type { BlogPost } from "@/lib/posts";

const calculateReadingTime = (text: string): string => {
  if (!text) return "3 min";
  return `${Math.ceil(text.trim().split(/\s+/).length / 200)} min`;
};

const calculateSize = (text: string): string => {
  const bytes = new Blob([text || ""]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.ceil(bytes / 1024)} KB`;
};

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid gap-6 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>FILE EXPLORER - /posts</span>
          <span>{sortedPosts.length} FILES</span>
        </div>
        <div className="system-content">
          <h1 className="text-3xl font-bold sm:text-5xl">Posts directory</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            Essays, experiments, and notes are indexed as archived files. Open a
            record to read the full dump.
          </p>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>NAME</span>
          <span className="hidden sm:inline">DATE / TYPE / SIZE</span>
        </div>
        <div className="posts-directory">
          <div className="posts-directory-root">posts/</div>
          {sortedPosts.length === 0 && (
            <div className="system-content text-white/70">No posts found.</div>
          )}

          {sortedPosts.map((post, index) => {
            const fileName = `${post.slug}.md`;
            const tag = post.tags?.[0] ?? "note";

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="post-file-row"
                data-sound-click="nav"
                data-sound-hover="tick"
              >
                <span className="post-file-permissions">-rw-r--r--</span>
                <span className="post-file-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-[#9c7cff]" />
                  <span className="min-w-0">
                    <strong className="block truncate">{fileName}</strong>
                    <small className="block truncate text-white/62">
                      {post.title}
                    </small>
                  </span>
                </span>
                <span className="post-file-date">{post.date || "unknown"}</span>
                <span className="post-file-meta">
                  {tag} / {calculateReadingTime(post.content)} / {calculateSize(post.content)} / ro
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
