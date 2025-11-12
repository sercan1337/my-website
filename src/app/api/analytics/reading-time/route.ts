import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const { slug, readingTime } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    if (!readingTime || typeof readingTime !== "number" || readingTime < 0) {
      return NextResponse.json(
        { error: "readingTime must be a positive number" },
        { status: 400 }
      );
    }

    if (readingTime >= 30) {
      const timestamp = Date.now();
      const readingData = { timestamp, readingTime };

      await redis.zadd(`reading-times:${slug}`, {
        score: timestamp,
        member: JSON.stringify(readingData),
      });

      await redis.zremrangebyrank(`reading-times:${slug}`, 0, -1001);

      const allReadingTimes = await redis.zrange(`reading-times:${slug}`, 0, -1);
      
      if (allReadingTimes.length > 0) {
        const times = allReadingTimes.map((entry) => {
          const data = JSON.parse(entry as string);
          return data.readingTime;
        });
        
        const averageTime = Math.round(
          times.reduce((a, b) => a + b, 0) / times.length
        );
        
        await redis.set(`avg-reading-time:${slug}`, averageTime);
      }
    }

    return NextResponse.json({ slug, readingTime, success: true });
  } catch (error) {
    console.error("Error recording reading time:", error);
    return NextResponse.json(
      { error: "Failed to record reading time" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const [averageTime, totalReads] = await Promise.all([
      redis.get(`avg-reading-time:${slug}`),
      redis.zcard(`reading-times:${slug}`),
    ]);

    return NextResponse.json({ 
      slug,
      averageReadingTime: averageTime ? Number(averageTime) : 0,
      totalReads: totalReads || 0
    });
  } catch (error) {
    console.error("Error fetching reading time stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading time stats" },
      { status: 500 }
    );
  }
}

