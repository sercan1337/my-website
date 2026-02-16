import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPostSlugs,
} from "@/lib/posts";
import { calculateReadingTime as calcReadTimeUtil } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";
import Comments from "@/components/Comments";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import MinimalDesignExample from "@/components/MinimalDesignExample";
import ClapButton from "@/components/ClapButton";
import { getClaps } from "@/app/actions";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Not Found | Sercan Duran",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Sercan Duran`,
    description: post.excerpt || "A blog post by Sercan Duran",
  };
}

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
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calcReadTimeUtil(post.content);
  const claps = await getClaps(resolvedParams.slug).catch(() => 0);

  const markdownComponents = {
    h2: ({ children }: any) => {
      const id = generateHeadingId(children?.toString() || "");
      return (
        <h2 
          id={id} 
          className="mt-12 mb-6 scroll-mt-24 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-6"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const id = generateHeadingId(children?.toString() || "");
      return <h3 id={id} className="mt-10 mb-4 scroll-mt-24 text-xl font-semibold text-gray-900 dark:text-white">{children}</h3>;
    },
    p: ({ children }: any) => <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-400">{children}</p>,
    ul: ({ children }: any) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ul>,
    ol: ({ children }: any) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ol>,
    li: ({ children }: any) => <li className="pl-2">{children}</li>,
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
    code: ({ children }: any) => <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-green-600 dark:bg-gray-900 dark:text-green-400 border border-gray-200 dark:border-gray-800">{children}</code>,
    pre: ({ children }: any) => <pre className="mb-8 overflow-x-auto rounded-xl bg-gray-900 p-4 border border-gray-800 shadow-lg">{children}</pre>,
    blockquote: ({ children }: any) => <blockquote className="my-8 border-l-4 border-green-500 pl-6 italic text-gray-700 dark:border-green-500 dark:text-gray-300 bg-green-50 dark:bg-green-900/10 py-4 rounded-r-lg">{children}</blockquote>,
    a: ({ href, children }: any) => <a href={href} className="text-green-600 font-medium hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline decoration-green-500/30 hover:decoration-green-500 transition-all">{children}</a>,
  };

  return (
    <div className="min-h-screen relative transition-colors duration-500 animate-in fade-in zoom-in-95 duration-700">
      
      <article className="relative z-10 mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_250px]">
          
          <div className="mx-auto w-full min-w-0">
            
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mb-8 inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white group transition-colors pl-0 hover:bg-transparent"
              )}
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>

            <header className="mb-10 pb-6 border-b border-[#42CF8E] dark:border-gray-600/50">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm font-mono text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
              </div>
            </header>

            <div className="markdown-content prose prose-lg prose-gray dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
              prose-code:text-green-600 dark:prose-code:text-green-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            ">
                {post.content.includes("<MinimalDesignExample />") ? (
                post.content.split("<MinimalDesignExample />").map((part, index, array) => (
                  <div key={index}>
                    <ReactMarkdown components={markdownComponents}>
                      {part}
                    </ReactMarkdown>
                    {index < array.length - 1 && <MinimalDesignExample />}
                  </div>
                ))
              ) : (
                <ReactMarkdown components={markdownComponents}>
                  {post.content}
                </ReactMarkdown>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="mb-10 flex justify-center md:justify-start">
                <ClapButton slug={resolvedParams.slug} initialClaps={claps} />
              </div>
              
              {/* Comments başlığı kaldırıldı, doğrudan bileşen çağrılıyor */}
              <Comments slug={resolvedParams.slug} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}