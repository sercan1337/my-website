import Link from "next/link";
import { IconBrandGithub, IconBrandX, IconMail } from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
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
          <div className="absolute h-[200%] w-[200%] -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
            bg-[size:30px_30px] 
            animate-grid">
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_10%,black)] dark:bg-gray-950 pointer-events-none transition-colors duration-500"></div>
        

        <section className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
          <div className="mx-auto max-w-3xl text-center">
            
            <h1 className="text-6xl font-semibold tracking-tight text-gray-900 transition-colors duration-500 dark:text-white sm:text-7xl" style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600 }}>
              Welcome to My Blog!
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 transition-colors duration-500 dark:text-gray-400">
              I write about coding, machine learning, and life experiences. Explore
              my thoughts and learnings about coding.
            </p>

            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-x-5">
                
                <Link href="/blog">
                  <Button 
                    variant="ghost" 
                    className="group h-9 px-6 text-sm font-medium border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-colors duration-300"
                  >
                    Read Blog
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>

                <Link href="/about">
                  <Button 
                    variant="ghost" 
                    className="group h-9 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Learn more 
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-x-5 text-gray-400">
                <a href="https://github.com/ncrz1337" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  <IconBrandGithub size={20} stroke={1.5} />
                </a>
                <a href="https://x.com/ncrz1337" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  <IconBrandX size={20} stroke={1.5} />
                </a>
                <a href="mailto:sercanking40@gmail.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">     
                  <IconMail size={20} stroke={1.5} />
                </a>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}