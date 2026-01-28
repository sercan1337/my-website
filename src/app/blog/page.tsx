import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogList from "@/components/BlogPostsList";

export const metadata: Metadata = {
  title: "Blog | Sercan Duran",
  description: "Writing on software, design, and what I'm learning.",
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <BlogList posts={allPosts} />
  );
}