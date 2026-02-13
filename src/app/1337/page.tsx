"use client";

import Link from "next/link";
import { IconBrandGithub, IconBrandX, IconMail, IconTerminal2 } from "@tabler/icons-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Leet1337() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full overflow-hidden relative flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      
      <section className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="mx-auto max-w-2xl text-center">
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full">
              <IconTerminal2 className="h-10 w-10 text-[#42CF8E] dark:text-white" stroke={1.5} />
            </div>
          </div>

          <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-8xl font-mono">
            1337
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            You found the hidden layer. Welcome to the elite zone.
            <br />
            <span className="text-sm opacity-90 font-mono text-[#42CF8E] dark:text-white">
              (System status: Operational)
            </span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="group h-9 px-6 text-sm font-medium border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 hover:border-white hover:text-white-600 dark:hover:border-white dark:hover:text-white-400 transition-colors duration-300"
              >
                return home
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              </Button>
            </Link>

            <Link href="/blog">
              <Button 
                variant="ghost" 
                className="group h-9 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#42CF8E] dark:hover:text-white transition-colors"
              >
                read blog
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>

          </div>

            <div className="mt-10 flex items-center justify-center gap-x-6 text-gray-400">
                <Link href="https://github.com/sercan1337" target="_blank" className="hover:text-[#42CF8E] dark:hover:text-white transition-colors">
                  <IconBrandGithub size={20} stroke={1.5} />
                </Link>
                <Link href="https://x.com/sercan1337" target="_blank" className="hover:text-[#42CF8E] dark:hover:text-white transition-colors">
                  <IconBrandX size={20} stroke={1.5} />
                </Link>
                <Link href="mailto:sercanduran40@hotmail.com" className="hover:text-[#42CF8E] dark:hover:text-white transition-colors">     
                  <IconMail size={20} stroke={1.5} />
                </Link>
            </div>

        </div>
      </section>
      
    </div>
  );
}