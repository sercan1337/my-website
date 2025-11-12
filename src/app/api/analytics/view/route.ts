import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

// POST - Increment view count for a post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    // Increment view count
    const viewCount = await redis.incr(`views:${slug}`);

    // Also track daily views for analytics
    const today = new Date().toISOString().split("T")[0];
    await redis.incr(`views:daily:${slug}:${today}`);

    return NextResponse.json({ 
      slug, 
      viewCount,
      success: true 
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}

// GET - Get view count for a post
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

    const viewCount = await redis.get(`views:${slug}`);

    return NextResponse.json({ 
      slug, 
      viewCount: viewCount ? Number(viewCount) : 0 
    });
  } catch (error) {
    console.error("Error fetching view count:", error);
    return NextResponse.json(
      { error: "Failed to fetch view count" },
      { status: 500 }
    );
  }
}

