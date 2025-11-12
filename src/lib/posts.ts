import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime as calcReadingTime } from "./utils";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

export function getAllPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.error(`Posts directory does not exist: ${postsDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "",
          date: data.date || "",
          excerpt: data.excerpt || "",
          content: content.trim(),
          tags: data.tags || [],
        };
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return allPostsData;
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      content: content.trim(),
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.error(`Posts directory does not exist: ${postsDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}

/**
 * Get related posts based on shared tags
 * Returns up to 3 related posts (excluding the current post)
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost || !currentPost.tags || currentPost.tags.length === 0) {
    return [];
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags?.filter((tag) =>
        currentPost.tags?.includes(tag)
      ) || [];
      return {
        post,
        score: sharedTags.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return relatedPosts;
}

/**
 * Calculate reading time in minutes based on content length
 * Re-exported from utils for convenience
 */
export function calculateReadingTime(content: string): number {
  return calcReadingTime(content);
}

/**
 * Content statistics interface
 */
export interface ContentStats {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  paragraphCount: number;
  headingCount: number;
  readingTime: number;
}

/**
 * Get detailed statistics about content
 */
export function getContentStats(content: string): ContentStats {
  const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags if any
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, "").length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Count headings (markdown headings)
  const headingRegex = /^#{1,6}\s+.+$/gm;
  const headings = content.match(headingRegex) || [];
  
  return {
    wordCount: words.length,
    characterCount: characters,
    characterCountNoSpaces: charactersNoSpaces,
    paragraphCount: paragraphs.length,
    headingCount: headings.length,
    readingTime: calcReadingTime(content),
  };
}

/**
 * Heading interface for table of contents
 */
export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagsSet = new Set<string>();
  
  allPosts.forEach((post) => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Get posts filtered by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );
}

/**
 * Get tag count (how many posts have each tag)
 */
export function getTagCounts(): Record<string, number> {
  const allPosts = getAllPosts();
  const tagCounts: Record<string, number> = {};
  
  allPosts.forEach((post) => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return tagCounts;
}

/**
 * Search posts by query string (searches in title, excerpt, and content)
 */
export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) {
    return getAllPosts();
  }
  
  const searchTerm = query.toLowerCase().trim();
  const allPosts = getAllPosts();
  
  return allPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    const tagMatch = post.tags?.some((tag) => 
      tag.toLowerCase().includes(searchTerm)
    );
    
    return titleMatch || excerptMatch || contentMatch || tagMatch;
  });
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, "").replace(/[#*`]/g, "").trim();
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to cut at a sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastExclamation = truncated.lastIndexOf("!");
  const lastQuestion = truncated.lastIndexOf("?");
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  return truncated.trim() + "...";
}

/**
 * Format date string to a more readable format
 */
export function formatDate(dateString: string, locale: string = "tr-TR"): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Get posts by date range
 */
export function getPostsByDateRange(
  startDate: Date,
  endDate: Date
): BlogPost[] {
  const allPosts = getAllPosts();
  
  return allPosts.filter((post) => {
    try {
      const postDate = new Date(post.date);
      return postDate >= startDate && postDate <= endDate;
    } catch (error) {
      return false;
    }
  });
}

/**
 * Get recent posts (last N posts)
 */
export function getRecentPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

/**
 * Get posts by year
 */
export function getPostsByYear(year: number): BlogPost[] {
  const allPosts = getAllPosts();
  
  return allPosts.filter((post) => {
    try {
      const postDate = new Date(post.date);
      return postDate.getFullYear() === year;
    } catch (error) {
      return false;
    }
  });
}

/**
 * Get all available years from posts
 */
export function getAllYears(): number[] {
  const allPosts = getAllPosts();
  const yearsSet = new Set<number>();
  
  allPosts.forEach((post) => {
    try {
      const postDate = new Date(post.date);
      if (!isNaN(postDate.getTime())) {
        yearsSet.add(postDate.getFullYear());
      }
    } catch (error) {
      // Skip invalid dates
    }
  });
  
  return Array.from(yearsSet).sort((a, b) => b - a);
}

/**
 * Get content metadata summary
 */
export interface ContentMetadata {
  stats: ContentStats;
  headings: Heading[];
  hasCodeBlocks: boolean;
  hasImages: boolean;
  hasLinks: boolean;
}

/**
 * Get comprehensive content metadata
 */
export function getContentMetadata(content: string): ContentMetadata {
  const stats = getContentStats(content);
  const headings = extractHeadings(content);
  
  // Check for code blocks
  const hasCodeBlocks = /```[\s\S]*?```|`[^`]+`/.test(content);
  
  // Check for images (markdown or HTML)
  const hasImages = /!\[.*?\]\(.*?\)|<img/i.test(content);
  
  // Check for links (markdown or HTML)
  const hasLinks = /\[.*?\]\(.*?\)|<a\s/i.test(content);
  
  return {
    stats,
    headings,
    hasCodeBlocks,
    hasImages,
    hasLinks,
  };
}