import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPostSlugs,
} from "@/lib/posts";
import { calculateReadingTime as calcReadTimeUtil } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";
import Comments from "@/components/Comments";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import ClapButton from "@/components/ClapButton";
import { getClaps } from "@/app/actions";
import Spoiler from "@/components/Spoiler";

import { MDXRemote } from "next-mdx-remote/rsc";
import MinimalDesignExample from "@/components/MinimalDesignExample";
import BeforeAfter from "@/components/BeforeAfter"; 

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

type MdxComponentProps = {
  children?: ReactNode;
  href?: string;
};

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
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const fileName = `${resolvedParams.slug}.md`;

  const mdxComponents = {
    h2: ({ children }: MdxComponentProps) => {
      const id = generateHeadingId(children?.toString() || "");
      return (
        <h2 
          id={id} 
          className="mt-12 mb-6 scroll-mt-24 text-2xl font-bold text-gray-900 dark:text-white border-b border-[#8b5cf6]/30 dark:border-[#8b5cf6]/30 pb-6"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }: MdxComponentProps) => {
      const id = generateHeadingId(children?.toString() || "");
      return <h3 id={id} className="mt-10 mb-4 scroll-mt-24 text-xl font-semibold text-gray-900 dark:text-white">{children}</h3>;
    },
    p: ({ children }: MdxComponentProps) => <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-400">{children}</p>,
    ul: ({ children }: MdxComponentProps) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400 marker:text-[#9c7cff]">{children}</ul>,
    ol: ({ children }: MdxComponentProps) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400 marker:text-[#9c7cff]">{children}</ol>,
    li: ({ children }: MdxComponentProps) => <li className="pl-2">{children}</li>,
    strong: ({ children }: MdxComponentProps) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
    code: ({ children }: MdxComponentProps) => <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-[#9c7cff] dark:bg-gray-900 dark:text-[#b7a6ff] border border-gray-200 dark:border-gray-800">{children}</code>,
    pre: ({ children }: MdxComponentProps) => <pre className="mb-8 overflow-x-auto rounded-xl bg-gray-900 p-4 border border-gray-800 shadow-lg">{children}</pre>,
    blockquote: ({ children }: MdxComponentProps) => <blockquote className="my-8 border-l-4 border-[#9c7cff] pl-6 italic text-gray-700 dark:border-[#9c7cff] dark:text-gray-300 bg-indigo-50 dark:bg-indigo-950/20 py-4 rounded-r-lg">{children}</blockquote>,
    a: ({ href, children }: MdxComponentProps) => <a href={href} className="text-[#9c7cff] font-medium hover:text-[#c7bbff] underline decoration-[#9c7cff]/40 hover:decoration-[#9c7cff] transition-all">{children}</a>,
    
    MinimalDesignExample,
    BeforeAfter, 
    Spoiler,
  };

  return (
    <div className="min-h-screen relative transition-colors duration-500 animate-in fade-in zoom-in-95 duration-700 pb-20">
      
      <article className="system-window relative z-10 mx-auto max-w-[90rem]">
        <div className="system-titlebar">
          <span>{`OPEN DOCUMENT - /posts/${fileName}`}</span>
          <span>{readingTime} MIN READ</span>
        </div>
        <div className="system-content">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_250px]">
          
          <div className="mx-auto w-full min-w-0">
            
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "retro-command mb-8 inline-flex items-center gap-2 p-2 text-sm"
              )}
              data-sound-click="nav"
              data-sound-hover="tick"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>

            <header className="document-header mb-10 border-b border-white/35 pb-6">
              <div className="document-path">
                <span>-rw-r--r--</span>
                <span>{fileName}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-white/64">
                  <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
              </div>

              <dl className="document-status-grid">
  {[
    ["PATH", `/posts/${fileName}`],
    ["MODE", "READ ONLY"],
    ["TYPE", "MARKDOWN"],
    ["WORDS", String(wordCount)],
  ].map(([label, value]) => (
    <div key={label}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  ))}
</dl>
            </header>

            <div className="document-buffer markdown-content prose prose-lg prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-[#9c7cff] dark:prose-a:text-[#b7a6ff] prose-a:no-underline hover:prose-a:underline
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
              prose-code:text-[#9c7cff] dark:prose-code:text-[#b7a6ff] prose-code:bg-gray-100 dark:prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            ">
                <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            <div className="document-eof" aria-label="End of file metadata">
              <p>EOF</p>
              <p>END OF FILE</p>
              <p>checksum: ok</p>
              <Link href="/blog" data-sound-click="nav" data-sound-hover="tick">
                return: /posts
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-[#8b5cf6]/30 dark:border-[#8b5cf6]/30">
              <div className="mb-10 flex justify-center md:justify-start">
                <ClapButton slug={resolvedParams.slug} initialClaps={claps} />
              </div>
              
              <Comments slug={resolvedParams.slug} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
        </div>
      </article>
    </div>
  );
}
