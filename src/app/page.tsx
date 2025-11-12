import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { calculateReadingTime } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PopularPosts from "@/components/PopularPosts";
import { Clock } from "lucide-react";

function ButtonWithIcon() {
  return (
    <Link href="/about" className="cursor-pointer">
      <Button variant="outline" className="px-6 py-3 text-sm font-semibold cursor-pointer button-border-glow">
        Learn more <IconArrowRight />
      </Button>
    </Link> 
  );
}

export default function Home() {
  const blogPosts = getAllPosts();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 transition-colors duration-600 dark:text-white sm:text-6xl">
            Welcome to My Blog!
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 transition-colors duration-600 dark:text-gray-400">
            I write about coding, machine learning, and life experiences. Explore
            my thoughts and learnings about coding.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/blog">
              <Button variant="outline" className="px-6 py-3 text-sm font-semibold button-border-glow">
                Read Blog
              </Button>
            </Link>
            <ButtonWithIcon />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-600 dark:text-white sm:text-4xl">
            Latest Posts
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-all duration-600 post-card-hover dark:border-gray-800 dark:bg-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-600 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                  {post.title}
                </h3>
                <p className={`mt-3 ${index === 1 ? 'text-base' : 'text-sm'} text-gray-600 transition-colors duration-600 dark:text-gray-400`}>
                  {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 transition-colors duration-600 dark:text-gray-500">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTime(post.content)} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="text-sm font-semibold text-gray-900 transition-colors duration-600 dark:text-white"
            >
              View all posts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <PopularPosts limit={3} />
        </div>
      </section>
    </div>
  );
}
