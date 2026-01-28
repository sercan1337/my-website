import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
  userId?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
    }

    const commentIds = await redis.lrange(`comments:${postSlug}`, 0, -1);

    if (!commentIds || commentIds.length === 0) {
      return NextResponse.json([]);
    }

    const comments = await Promise.all(
      commentIds.map(async (id: string) => {
        const commentData = await redis.hgetall(id);
        if (!commentData || Object.keys(commentData).length === 0) {
          return null;
        }
        const comment: Comment = {
          id: commentData.id as string,
          postSlug: commentData.postSlug as string,
          author: commentData.author as string,
          content: commentData.content as string,
          createdAt: commentData.createdAt as string,
        };
        if (commentData.parentId) {
          comment.parentId = commentData.parentId as string;
        }
        return comment;
      })
    );

    const validComments = comments
      .filter((c): c is Comment => c !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(validComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const { postSlug, content, parentId } = await request.json();

    if (!postSlug || !content) {
      return NextResponse.json(
        { error: "postSlug and content are required" },
        { status: 400 }
      );
    }

    const author =
      session.user.name?.trim() || session.user.email || "Anonymous";

    const commentId = `comment:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

    const comment: Comment = {
      id: commentId,
      postSlug,
      author,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      userId: session.user.id,
    };
    if (parentId) {
      comment.parentId = parentId;
    }

    const commentData: Record<string, string> = {
      id: comment.id,
      postSlug: comment.postSlug,
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId ?? "",
    };
    if (comment.parentId) {
      commentData.parentId = comment.parentId;
    }

    await redis.hset(commentId, commentData);
    await redis.lpush(`comments:${postSlug}`, commentId);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

