import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getAllPosts } from "@/lib/posts";

// GET - Get popular posts based on view count and reading time
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const allPosts = getAllPosts();
    
    // Get view counts for all posts
    const postsWithStats = await Promise.all(
      allPosts.map(async (post) => {
        const viewCount = await redis.get(`views:${post.slug}`);
        const avgReadingTime = await redis.get(`avg-reading-time:${post.slug}`);
        
        return {
          ...post,
          viewCount: viewCount ? Number(viewCount) : 0,
          averageReadingTime: avgReadingTime ? Number(avgReadingTime) : 0,
        };
      })
    );

    // Sort by view count (and reading time as secondary)
    const popularPosts = postsWithStats
      .filter((post) => post.viewCount > 0)
      .sort((a, b) => {
        // Primary sort: view count
        if (b.viewCount !== a.viewCount) {
          return b.viewCount - a.viewCount;
        }
        // Secondary sort: average reading time
        return b.averageReadingTime - a.averageReadingTime;
      })
      .slice(0, limit)
      .map(({ viewCount, averageReadingTime, ...post }) => ({
        ...post,
        viewCount,
        averageReadingTime,
      }));

    return NextResponse.json({ posts: popularPosts });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular posts" },
      { status: 500 }
    );
  }
}

