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
import MinimalDesignExample from "@/components/MinimalDesignExample";

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
        <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="mx-auto max-w-3xl w-full">
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "mb-10 inline-flex items-center gap-2 back-to-blog-button hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <span>←</span> Back to Blog
            </Link>

            {/* Title and Meta */}
            <header className="mb-12 border-b border-gray-200 pb-8 dark:border-gray-800">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{post.date}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
                  <ViewCount slug={resolvedParams.slug} />
                </div>

                {/* Share Buttons */}
                <div className="flex-shrink-0">
                  <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Markdown Content */}
            <div className="markdown-content prose prose-lg dark:prose-invert max-w-none">
              {post.content.includes("<MinimalDesignExample />") ? (
                post.content.split("<MinimalDesignExample />").map((part, index, array) => (
                  <div key={index}>
                    <ReactMarkdown
                      components={{
                  h2: ({ children }) => {
                    const id = generateHeadingId(children?.toString() || "");
                    return (
                      <h2
                        id={id}
                        className="mt-12 mb-6 scroll-mt-20 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 pb-3 dark:border-gray-800"
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
                        className="mt-10 mb-4 scroll-mt-20 text-xl font-semibold text-gray-900 dark:text-white"
                      >
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="mb-6 text-base leading-7 text-gray-600 dark:text-gray-400">
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
                    <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-6 border-l-4 border-blue-500 pl-6 italic text-gray-700 dark:border-blue-400 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 py-4 rounded-r-lg">
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
                {part}
              </ReactMarkdown>
                    {index < array.length - 1 && <MinimalDesignExample />}
                  </div>
                ))
              ) : (
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
              )}
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <RelatedPosts posts={relatedPosts} />
            </div>

            {/* Comments */}
            <div className="mt-16">
              <Comments term={resolvedParams.slug} />
            </div>

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

