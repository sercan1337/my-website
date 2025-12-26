"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { FileText, User, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/posts";

interface NavigationMenuContentProps {
  recentPosts: BlogPost[];
  allTags: string[];
}

function BlogNavigationContent({ recentPosts, allTags }: NavigationMenuContentProps) {
  return (
    <NavigationMenuContent>
      <div className="w-[400px] p-4">
        <div className="grid gap-3">
          <NavigationMenuLink asChild>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  All Posts
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  View all blog posts
                </div>
              </div>
            </Link>
          </NavigationMenuLink>

          {recentPosts.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Recent Posts
              </div>
              {recentPosts.map((post) => (
                <NavigationMenuLink key={post.slug} asChild>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </div>
                    {post.excerpt && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                        {post.excerpt}
                      </div>
                    )}
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          )}

          {allTags.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </NavigationMenuContent>
  );
}

export default function SiteNavigation({ recentPosts, allTags }: NavigationMenuContentProps) {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="w-full justify-center">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/" className="text-sm font-medium text-gray-700 transition-colors duration-[600ms] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <div className="group relative flex items-center gap-2">
            <Link 
              href="/blog"
              className="text-sm font-medium text-gray-700 transition-colors duration-[600ms] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Blog
            </Link>
            <NavigationMenuTrigger className="text-sm font-medium text-gray-700 transition-colors duration-[600ms] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-0 h-auto w-auto ml-0 data-[state=open]:bg-transparent [&_svg]:hidden">
            </NavigationMenuTrigger>
          </div>
          <BlogNavigationContent recentPosts={recentPosts} allTags={allTags} />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <div className="group relative flex items-center gap-2">
            <Link 
              href="/about"
              className="text-sm font-medium text-gray-700 transition-colors duration-[600ms] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </Link>
            <NavigationMenuTrigger className="text-sm font-medium text-gray-700 transition-colors duration-[600ms] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-0 h-auto w-auto ml-0 data-[state=open]:bg-transparent [&_svg]:hidden">
            </NavigationMenuTrigger>
          </div>
          <NavigationMenuContent>
            <div className="w-[300px] p-4">
              <div className="grid gap-2">
                <NavigationMenuLink asChild>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        About Me
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Learn more about me
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

