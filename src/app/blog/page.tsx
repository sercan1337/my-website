import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogList from "@/components/BlogPostsList";

export const metadata: Metadata = {
  title: "Blog | Sercan Duran",
  description: "writing on software, design, and what I'm learning.",
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <section>
       <BlogList posts={allPosts} />
    </section>
  );
}