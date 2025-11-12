import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
} from "@/lib/posts";
import { calculateReadingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import Comments from "@/components/Comments";
import RatingDrawer from "@/components/RatingDrawer";
import ReadingProgress from "@/components/ReadingProgress";
import ViewCount from "@/components/ViewCount";
import PostStats from "@/components/PostStats";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ReadingMode from "@/components/ReadingMode";
import { Clock } from "lucide-react";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Helper function to generate ID from heading text
function generateHeadingId(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const relatedPosts = getRelatedPosts(resolvedParams.slug);

  return (
    <ReadingMode>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <AnalyticsTracker slug={resolvedParams.slug} />
        <ReadingProgress />
        <article className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "mb-8 inline-flex items-center gap-2 back-to-blog-button"
              )}
            >
              <span>←</span> Back to Blog
            </Link>

            {/* Title and Meta */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
                <ViewCount slug={resolvedParams.slug} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-6">
                <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
              </div>
            </header>

            {/* Markdown Content */}
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => {
                    const id = generateHeadingId(children?.toString() || "");
                    return (
                      <h2
                        id={id}
                        className="mt-8 mb-4 scroll-mt-20 text-2xl font-bold text-gray-900 dark:text-white"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const id = generateHeadingId(children?.toString() || "");
                    return (
                      <h3
                        id={id}
                        className="mt-6 mb-3 scroll-mt-20 text-xl font-semibold text-gray-900 dark:text-white"
                      >
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base leading-7">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-white">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:border-gray-600 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} />

            {/* Comments */}
            <Comments term={resolvedParams.slug} />

            {/* Rating Drawer */}
            <RatingDrawer slug={resolvedParams.slug} title={post.title} />
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents content={post.content} />
              <PostStats slug={resolvedParams.slug} />
            </div>
          </aside>
        </div>
      </article>
    </div>
    </ReadingMode>
  );
}

