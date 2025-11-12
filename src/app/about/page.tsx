"use client";

import AuthorHoverCard from "@/components/AuthorHoverCard";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            About Me
          </h1>
          <div className="mt-10 space-y-6 text-base leading-9 text-gray-600 dark:text-gray-400">
            <p>
            Hi, I&apos;m <AuthorHoverCard><span className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Sercan</span></AuthorHoverCard>. I&apos;m an eager, passionate developer who loves learning new things. Here, I share my thoughts, projects, and what I&apos;ve learned.
            </p>
            <p>
            I&apos;m currently a student in Türkiye. I&apos;m interested in web development, machine learning, and artificial intelligence. I&apos;m also a big fan of Formula 1.
            </p>
            <h2 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
              Get in Touch
            </h2>
            <p>
              Feel free to reach out! You can find me on these platforms:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/ncrz25"  
                target="_blank"   
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-500 hover:bg-white hover:text-gray-900 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900 post-card-hover github-hover"
              >
                <svg
                  className="h-6 w-6 fill-gray-700 transition-colors duration-500 group-hover:fill-[#181717] dark:fill-gray-300 dark:group-hover:fill-[#181717]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.youtube.com/@Nacrez"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-500 hover:bg-white hover:text-gray-900 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900 post-card-hover youtube-hover"
              >
                <svg
                  className="h-6 w-6 fill-gray-700 transition-colors duration-500 group-hover:fill-[#FF0000] dark:fill-gray-300"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
                YouTube
              </a>
              <a
                href="https://x.com/Nacr3z"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-500 hover:bg-white hover:text-gray-900 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900 post-card-hover x-hover"
              >
                <svg
                  className="h-4 w-4 fill-gray-700 transition-colors duration-500 group-hover:fill-[#000000] dark:fill-gray-300 dark:group-hover:fill-[#000000]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"  
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

