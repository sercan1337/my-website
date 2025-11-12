"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Github, Youtube, Twitter } from "lucide-react";

export default function AuthorHoverCard({ children }: { children: React.ReactNode }) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 origin-top bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/50">
              SD
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sercan Duran
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Developer & Student
              </p>
            </div>
          </div>
          
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
            Passionate developer interested in web development, machine learning, and AI.
          </p>

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Connect
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://github.com/ncrz25"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/Nacr3z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@Nacrez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
              >
                <Youtube className="h-4 w-4" /> 
              </a>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
