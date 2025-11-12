"use client";

import AuthorHoverCard from "./AuthorHoverCard";

const socialLinks = [
  {
    name: "Twitter",
    href: "https://x.com/Nacr3z",
  },
  {
    name: "GitHub",
    href: "https://github.com/ncrz1337",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Nacrez",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <AuthorHoverCard>
            <p className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
              Sercan Duran
            </p>
          </AuthorHoverCard>
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
        