import HomeExperience from "@/components/HomeExperience";
import { calculateReadingTime, getRecentPosts } from "@/lib/posts";

export default function Home() {
  const posts = getRecentPosts(3).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    readTime: calculateReadingTime(post.content),
  }));

  return <HomeExperience posts={posts} />;
}
