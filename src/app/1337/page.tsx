"use client";

import Link from "next/link";
import { IconBrandGithub, IconBrandX, IconMail, IconTerminal2 } from "@tabler/icons-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Leet1337() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        .animate-grid {
          animation: grid-move 3s linear infinite;
        }
      `}} />

      <div className="h-[calc(100vh-5rem)] w-full overflow-hidden relative flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
        
        <div className="absolute inset-0 h-full w-full">
          <div className="absolute h-full w-full -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.1)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(34,197,94,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.2)_1px,transparent_1px)] 
            bg-size-[30px_30px]
            animate-grid">
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_10%,black)] dark:bg-gray-950 pointer-events-none transition-colors duration-500"></div>

        <section className="relative z-20 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="mx-auto max-w-2xl text-center">
            
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                <IconTerminal2 className="h-10 w-10 text-green-600 dark:text-green-400" stroke={1.5} />
              </div>
            </div>

            <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-8xl font-mono">
              1337
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              You found the hidden layer. Welcome to the elite zone.
              <br />
              <span className="text-sm opacity-70 font-mono text-green-600 dark:text-green-400">
                (System status: Operational)
              </span>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="group h-9 px-6 text-sm font-medium border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 hover:border-green-500 hover:text-green-600 dark:hover:border-green-400 dark:hover:text-green-400 transition-colors duration-300"
                >
                  Return Home
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
                </Button>
              </Link>

              <Link href="/blog">
                <Button 
                  variant="ghost" 
                  className="group h-9 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Read Blog
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>

            </div>

            <div className="mt-16 flex items-center justify-center gap-x-6 text-gray-400">
                <Link href="https://github.com/ncrz1337" target="_blank" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <IconBrandGithub size={20} stroke={1.5} />
                </Link>
                <Link href="https://x.com/ncrz1337" target="_blank" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <IconBrandX size={20} stroke={1.5} />
                </Link>
                <Link href="mailto:sercanking40@gmail.com" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">     
                  <IconMail size={20} stroke={1.5} />
                </Link>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}