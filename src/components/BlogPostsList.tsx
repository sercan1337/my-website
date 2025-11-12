"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "@/lib/posts";
import { calculateReadingTime } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Clock } from "lucide-react";

interface BlogPostsListProps {
  initialPosts: BlogPost[];
}

const POSTS_PER_PAGE = 4;

export default function BlogPostsList({ initialPosts }: BlogPostsListProps) {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get("tag");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filtered posts change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPosts.length]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Thoughts, tutorials, and insights on development and technology.
          </p>

          {/* Arama ve Filtreleme */}
          <div className="mt-12">
            <SearchBar 
              posts={initialPosts} 
              onFilterChange={setFilteredPosts}
              initialTag={tagFromUrl || undefined}
            />
          </div>

          {/* Blog Post Listesi */}
          <div className="mt-12 space-y-8">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="border-b border-gray-200 pb-8 dark:border-gray-800"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {calculateReadingTime(post.content)} min read
                      </span>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No posts found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => {
                    if (page === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
      </div>
    </div>
  );
}

