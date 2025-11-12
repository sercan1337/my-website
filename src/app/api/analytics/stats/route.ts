import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

// GET - Get comprehensive statistics for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    // Get view count
    const viewCount = await redis.get(`views:${slug}`);

    // Get reading time stats
    const averageTime = await redis.get(`avg-reading-time:${slug}`);
    const totalReads = await redis.zcard(`reading-times:${slug}`);

    // Get today's views
    const today = new Date().toISOString().split("T")[0];
    const todayViews = await redis.get(`views:daily:${slug}:${today}`);

    return NextResponse.json({
      slug,
      viewCount: viewCount ? Number(viewCount) : 0,
      todayViews: todayViews ? Number(todayViews) : 0,
      averageReadingTime: averageTime ? Number(averageTime) : 0,
      totalReads: totalReads || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

