import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Large 404 Display */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-9xl">
              404
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-600 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ animationDelay: "0s" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Friendly Message */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Oops! Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The page you&apos;re looking for seems to have wandered off into the digital void.
            <br />
            Don&apos;t worry, let&apos;s get you back on track!
          </p>

          {/* Navigation Options */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Home
            </Link>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Browse Blog
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              About Me
            </Link>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 text-gray-300 dark:text-gray-700">
            <svg
              className="mx-auto h-24 w-24 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

