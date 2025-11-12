import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const allPosts = getAllPosts();
    
    const postsWithStats = await Promise.all(
      allPosts.map(async (post) => {
        const [viewCount, avgReadingTime] = await Promise.all([
          redis.get(`views:${post.slug}`),
          redis.get(`avg-reading-time:${post.slug}`),
        ]);
        
        return {
          ...post,
          viewCount: viewCount ? Number(viewCount) : 0,
          averageReadingTime: avgReadingTime ? Number(avgReadingTime) : 0,
        };
      })
    );

    const popularPosts = postsWithStats
      .filter((post) => post.viewCount > 0)
      .sort((a, b) => {
        if (b.viewCount !== a.viewCount) {
          return b.viewCount - a.viewCount;
        }
        return b.averageReadingTime - a.averageReadingTime;
      })
      .slice(0, limit);

    return NextResponse.json({ posts: popularPosts });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json({ error: "Failed to fetch popular posts" }, { status: 500 });
  }
}

