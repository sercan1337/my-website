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
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx?$/, "");
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
    let fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.md`);
    }

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
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.mdx?$/, ""));
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}

export function calculateReadingTime(content: string): number {
  return calcReadingTime(content);
}

export interface ContentStats {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  paragraphCount: number;
  headingCount: number;
  readingTime: number;
}

export function getContentStats(content: string): ContentStats {
  const text = content.replace(/<[^>]*>/g, ""); 
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, "").length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
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


export interface Heading {
  id: string;
  text: string;
  level: number;
}


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


export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );
}


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


export function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, "").replace(/[#*`]/g, "").trim();
  
  if (text.length <= maxLength) {
    return text;
  }
  
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


export function formatDate(dateString: string, locale: string = "en-EN"): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
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


export function getRecentPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}


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
    }
  });
  
  return Array.from(yearsSet).sort((a, b) => b - a);
}


export interface ContentMetadata {
  stats: ContentStats;
  headings: Heading[];
  hasCodeBlocks: boolean;
  hasImages: boolean;
  hasLinks: boolean;
}


export function getContentMetadata(content: string): ContentMetadata {
  const stats = getContentStats(content);
  const headings = extractHeadings(content);
  
  const hasCodeBlocks = /```[\s\S]*?```|`[^`]+`/.test(content);
  
  const hasImages = /!\[.*?\]\(.*?\)|<img/i.test(content);
  
  const hasLinks = /\[.*?\]\(.*?\)|<a\s/i.test(content);
  
  return {
    stats,
    headings,
    hasCodeBlocks,
    hasImages,
    hasLinks,
  };
}