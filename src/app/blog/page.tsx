import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import BlogPostsList from "@/components/BlogPostsList";
import PopularPosts from "@/components/PopularPosts";

export default function Blog() {
  const blogPosts = getAllPosts();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <Suspense fallback={<div>Loading...</div>}>
            <BlogPostsList initialPosts={blogPosts} />
          </Suspense>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <PopularPosts limit={5} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

