import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import BlogPostsList from "@/components/BlogPostsList";

export default function Blog() {
  const blogPosts = getAllPosts();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogPostsList initialPosts={blogPosts} />
        </Suspense>
      </div>
    </div>
  );
}

