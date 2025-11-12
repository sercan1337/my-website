"use client";

import { useState, useMemo, useEffect } from "react";
import type { BlogPost } from "@/lib/posts";
import { TagCombobox } from "@/components/ui/tag-combobox";

interface SearchBarProps {
  posts: BlogPost[];
  onFilterChange: (filteredPosts: BlogPost[]) => void;
  initialTag?: string;
}

export default function SearchBar({ posts, onFilterChange, initialTag }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);

  // URL'den gelen tag'i başlangıçta ayarla veya güncelle
  useEffect(() => {
    if (initialTag) {
      setSelectedTags([initialTag]);
    }
  }, [initialTag]);

  // Tüm mevcut tag'leri topla
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Tag filtresi
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) => {
        if (!post.tags || post.tags.length === 0) return false;
        return selectedTags.some((tag) => post.tags?.includes(tag));
      });
    }

    // Arama filtresi - başlık ve içerikte arama
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sıralama
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        // Alfabetik sıralama
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (sortOrder === "desc") {
          return titleB.localeCompare(titleA);
        }
        return titleA.localeCompare(titleB);
      }
    });

    return sorted;
  }, [posts, searchQuery, sortBy, sortOrder, selectedTags]);

  // Filtrelenmiş postları parent component'e bildir
  useEffect(() => {
    onFilterChange(filteredAndSortedPosts);
  }, [filteredAndSortedPosts, onFilterChange]);

  return (
    <div className="space-y-4">
      {/* Arama Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts by title, excerpt, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-600"
          aria-label="Search blog posts"
        />
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Tag Filtreleme */}
      {allTags.length > 0 && (
        <TagCombobox
          tags={allTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          placeholder="Select tags to filter..."
        />
      )}

      {/* Filtreleme ve Sıralama */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-by"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-600"
            aria-label="Sort posts by"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-order"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Order:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-600 dark:focus:ring-gray-600"
            aria-label="Sort order"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {(searchQuery || selectedTags.length > 0) && (
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Found {filteredAndSortedPosts.length} post
            {filteredAndSortedPosts.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

