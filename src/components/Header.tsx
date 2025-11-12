import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import AuthorHoverCard from "./AuthorHoverCard";
import SiteNavigation from "./SiteNavigation";
import { getAllPosts } from "@/lib/posts";

export default function Header() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 3);
  
  // Get unique tags (limit to 5 most common)
  const tagCounts = new Map<string, number>();
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  const allTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm transition-colors duration-600 dark:border-gray-800 dark:bg-gray-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <AuthorHoverCard>
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 transition-all duration-300 ease-in-out hover:text-gray-600 dark:text-white dark:hover:text-gray-300 cursor-pointer"
          >
            Sercan Duran
          </Link>
        </AuthorHoverCard>
        <div className="flex items-center gap-8">
          <SiteNavigation recentPosts={recentPosts} allTags={allTags} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

