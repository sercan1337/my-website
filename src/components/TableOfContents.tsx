"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({
  content,
  className,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      matches.push({ id, text, level });
    }

    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0, 
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "sticky top-24 hidden max-h-[calc(100vh-6rem)] overflow-y-auto lg:block self-start py-4 pl-4",
        className
      )}
    >
      <h2 className="mb-4 text-xs font-bold tracking-widest text-black-500 uppercase dark:text-black-400">
      Table Of Contents
      </h2>
            <ul className="relative space-y-1 border-l border-gray-200 dark:border-gray-800">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          
          return (
            <li key={heading.id} className="relative">
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const y = element.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    setActiveId(heading.id);
                  }
                }}
                className={cn(
                  "block py-1 pr-2 transition-all duration-200 ease-in-out hover:text-gray-900 dark:hover:text-white",
                  heading.level === 3 ? "pl-6 text-xs" : "pl-4 text-sm",
                  isActive
                    ? "font-medium text-gray-900 dark:text-gray-50"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {heading.text}
              </a>
              
              {isActive && (
                <span 
                  className="absolute left-[-1px] top-1/2 h-full w-[2px] -translate-y-1/2 bg-[#42CF8E] dark:bg-gray-50 rounded-full"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}