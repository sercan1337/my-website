import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TopographyBackground from "@/components/TopographyBackground";

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
  return (
    <div className="min-h-screen bg-white/70 dark:bg-gray-900/70 relative z-10 flex items-center justify-center">
      <TopographyBackground />
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-6xl font-semibold tracking-tight text-gray-900 transition-colors duration-600 dark:text-white sm:text-7xl" style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600 }}>
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
    </div>
  );
}
