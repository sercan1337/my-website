import Link from "next/link";
import { IconBrandGithub, IconBrandX, IconMail } from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full overflow-hidden text-center animate-in fade-in zoom-in-95 duration-700">
      
      <section className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center gap-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 transition-colors duration-500 dark:text-white" 
            style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600 }}
          >
            Welcome to My Blog!
          </h1>
          
          <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600 transition-colors duration-500 dark:text-gray-400 px-2 sm:px-0">
            I write about coding, machine learning, and life experiences. Explore
            my thoughts and learnings about coding.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-x-5">
              
              <Link href="/blog">
                <Button 
                  variant="ghost" 
                  className="group h-9 px-6 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:bg-transparent transition-colors duration-300 rounded-full"
                >
                  read blog
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>

              <Link href="/about">
                <Button 
                  variant="ghost" 
                  className="group h-9 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-transparent transition-colors"
                >
                  learn more 
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-x-6 text-gray-400">
            <a href="https://github.com/sercan1337" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                  <IconBrandGithub size={20} stroke={1.5} />
                </a>
                <a href="https://x.com/sercan1337" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                  <IconBrandX size={20} stroke={1.5} />
                </a>
                <a href="mailto:sercanduran40@hotmail.com" className="hover:text-black dark:hover:text-white transition-colors">          
                  <IconMail size={20} stroke={1.5} />
                </a>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}