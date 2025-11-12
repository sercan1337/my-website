import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string; // For nested/reply comments
}

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json(
        { error: "postSlug is required" },
        { status: 400 }
      );
    }

    // Get all comment IDs for this post
    const commentIds = await redis.lrange(`comments:${postSlug}`, 0, -1);

    if (!commentIds || commentIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all comments
    const comments = await Promise.all(
      commentIds.map(async (id: string) => {
        const commentData = await redis.hgetall(id);
        if (!commentData || Object.keys(commentData).length === 0) {
          return null;
        }
        // Convert Redis hash to Comment object
        return {
          id: commentData.id as string,
          postSlug: commentData.postSlug as string,
          author: commentData.author as string,
          content: commentData.content as string,
          createdAt: commentData.createdAt as string,
          ...(commentData.parentId && { parentId: commentData.parentId as string }),
        } as Comment;
      })
    );

    // Filter out null values and sort by createdAt (newest first)
    const validComments = comments
      .filter((c): c is Comment => c !== null)
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    return NextResponse.json(validComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Add a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, content, parentId } = body;

    if (!postSlug || !author || !content) {
      return NextResponse.json(
        { error: "postSlug, author, and content are required" },
        { status: 400 }
      );
    }

    // Generate comment ID
    const commentId = `comment:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

    const comment: Comment = {
      id: commentId,
      postSlug,
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      ...(parentId && { parentId }),
    };

    // Store comment as a hash
    await redis.hset(commentId, {
      id: comment.id,
      postSlug: comment.postSlug,
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      ...(comment.parentId && { parentId: comment.parentId }),
    });

    // Add comment ID to the post's comment list
    await redis.lpush(`comments:${postSlug}`, commentId);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

