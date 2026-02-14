import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { comment } from "@/lib/schema"
import { redis } from "@/lib/redis"
import { eq, desc, and } from "drizzle-orm"

const CACHE_TTL = 300

interface CommentData {
  id: string
  text: string
  slug: string
  userId: string
  userName: string
  createdAt: string
}

async function getCommentsFromDb(slug: string): Promise<CommentData[]> {
  const comments = await db
    .select()
    .from(comment)
    .where(eq(comment.slug, slug))
    .orderBy(desc(comment.createdAt))

  return comments.map((c) => ({
    id: c.id,
    text: c.text,
    slug: c.slug,
    userId: c.userId,
    userName: c.userName,
    createdAt: c.createdAt.toISOString(),
  }))
}

async function getCachedComments(slug: string): Promise<CommentData[] | null> {
  const cached = await redis.get<CommentData[]>(`comments:${slug}`)
  if (!cached) return null
  return cached
}

async function cacheComments(slug: string, comments: CommentData[]): Promise<void> {
  await redis.set(`comments:${slug}`, comments, { ex: CACHE_TTL })
}

async function invalidateCache(slug: string): Promise<void> {
  await redis.del(`comments:${slug}`)
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { text, slug } = await req.json()

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const newComment = {
      id: crypto.randomUUID(),
      text: text.trim(),
      slug: slug,
      userId: session.user.id,
      userName: session.user.name,
      createdAt: new Date(),
    }

    await db.insert(comment).values(newComment)
    await invalidateCache(slug)

    return NextResponse.json({
      success: true,
      comment: {
        ...newComment,
        createdAt: newComment.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Comment error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const cached = await getCachedComments(slug)
    if (cached) {
      return NextResponse.json(cached)
    }

    const comments = await getCommentsFromDb(slug)
    await cacheComments(slug, comments)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Fetch comments error:", error)
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, slug } = await req.json()

    if (!id || !slug) {
      return NextResponse.json({ error: "ID and Slug required" }, { status: 400 })
    }

    const deleted = await db
      .delete(comment)
      .where(
        and(
          eq(comment.id, id),
          eq(comment.userId, session.user.id)
        )
      )
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 })
    }

    await invalidateCache(slug)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}