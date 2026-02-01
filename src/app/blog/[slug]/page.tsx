import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPostSlugs,
} from "@/lib/posts";
import { calculateReadingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";
import Comments from "@/components/Comments";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import MinimalDesignExample from "@/components/MinimalDesignExample";
import ClapButton from "@/components/ClapButton";
import { getClaps } from "@/app/actions";



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

  const readingTime = calculateReadingTime(post.content);
  const claps = await getClaps(resolvedParams.slug);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        .animate-grid {
          animation: grid-move 3s linear infinite;
        }
      `}} />

      <div className="min-h-screen relative bg-white dark:bg-gray-950 transition-colors duration-500">
        
        <div className="absolute inset-0 h-full w-full">
          <div className="absolute h-[100%] w-[100%] -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
            animate-grid"
            style={{ backgroundSize: '30px 30px' }}>
          </div>
          <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,transparent_20%,black)] dark:bg-gray-950"></div>
        </div>

        <article className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_250px]">
            
            <div className="mx-auto max-w-3xl w-full">
              
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "mb-8 inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white group transition-colors pl-0 hover:bg-transparent"
                )}
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
              </Link>

              <header className="mb-10 pb-6 border-b border-gray-100 dark:border-gray-800/50">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 font-mono leading-tight">
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
                      <ReactMarkdown
                        components={{
                          h2: ({ children }) => {
                            const id = generateHeadingId(children?.toString() || "");
                            return <h2 id={id} className="mt-12 mb-6 scroll-mt-24 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200/50 pb-2 dark:border-gray-800/50">{children}</h2>;
                          },
                          h3: ({ children }) => {
                            const id = generateHeadingId(children?.toString() || "");
                            return <h3 id={id} className="mt-10 mb-4 scroll-mt-24 text-xl font-semibold text-gray-900 dark:text-white">{children}</h3>;
                          },
                          p: ({ children }) => <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-400">{children}</p>,
                          ul: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ol>,
                          li: ({ children }) => <li className="pl-2">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                          code: ({ children }) => <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-green-600 dark:bg-gray-900 dark:text-green-400 border border-gray-200 dark:border-gray-800">{children}</code>,
                          pre: ({ children }) => <pre className="mb-8 overflow-x-auto rounded-xl bg-gray-900 p-4 border border-gray-800 shadow-lg">{children}</pre>,
                          blockquote: ({ children }) => <blockquote className="my-8 border-l-4 border-green-500 pl-6 italic text-gray-700 dark:border-green-500 dark:text-gray-300 bg-green-50 dark:bg-green-900/10 py-4 rounded-r-lg">{children}</blockquote>,
                          a: ({ href, children }) => <a href={href} className="text-green-600 font-medium hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline decoration-green-500/30 hover:decoration-green-500 transition-all">{children}</a>,
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
                            return <h2 id={id} className="mt-12 mb-6 scroll-mt-24 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200/50 pb-2 dark:border-gray-800/50">{children}</h2>;
                        },
                        h3: ({ children }) => {
                            const id = generateHeadingId(children?.toString() || "");
                            return <h3 id={id} className="mt-10 mb-4 scroll-mt-24 text-xl font-semibold text-gray-900 dark:text-white">{children}</h3>;
                        },
                        p: ({ children }) => <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-400">{children}</p>,
                        ul: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400 marker:text-green-500">{children}</ol>,
                        li: ({ children }) => <li className="pl-2">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                        code: ({ children }) => <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-green-600 dark:bg-gray-900 dark:text-green-400 border border-gray-200 dark:border-gray-800">{children}</code>,
                        pre: ({ children }) => <pre className="mb-8 overflow-x-auto rounded-xl bg-gray-900 p-4 border border-gray-800 shadow-lg">{children}</pre>,
                        blockquote: ({ children }) => <blockquote className="my-8 border-l-4 border-green-500 pl-6 italic text-gray-700 dark:border-green-500 dark:text-gray-300 bg-green-50 dark:bg-green-900/10 py-4 rounded-r-lg">{children}</blockquote>,
                        a: ({ href, children }) => <a href={href} className="text-green-600 font-medium hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline decoration-green-500/30 hover:decoration-green-500 transition-all">{children}</a>,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                )}
              </div>

              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="mb-10 flex justify-center md:justify-start">
                  <ClapButton slug={resolvedParams.slug} initialClaps={claps} />
                </div>
                
                <div className="mb-12">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-mono">
                      Comments
                   </h3>
                   <Comments slug={resolvedParams.slug} />
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </article>
      </div>
    </>
  );
}