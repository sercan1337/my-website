"use client";

import Link from "next/link";
import { 
  MapPin,
  Github,
  Twitter,
  Mail,
  GraduationCap
} from "lucide-react";

export default function About() {
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

      <div className="min-h-full w-full relative bg-white dark:bg-gray-950 transition-colors duration-500 flex flex-col items-center justify-center p-4 py-24">
        
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
            animate-grid"
            style={{ backgroundSize: '30px 30px' }}>
          </div>
          <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,transparent_20%,black)] dark:bg-gray-950"></div>
        </div>

        <main className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(140px,auto)]">
          
          <div className="md:col-span-2 md:row-span-2 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col justify-between group hover:border-green-500/40 transition-all duration-300">
             <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-mono tracking-tighter">
                  Sercan Duran
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-6">
                  Student
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  I&apos;m a 9th-grade student with a passion for building software. 
                  I combine modern web technologies with clean design to create exceptional user experiences. 
                  Always learning, always shipping.
                </p>
             </div>
             
             <div className="mt-8 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-mono font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available for projects
                </div>
             </div>
          </div>

          <div className="md:col-span-1 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
             <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <MapPin size={20} />
                <span className="text-xs font-mono">LOCATION</span>
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Turkey</h3>
                <p className="text-sm text-gray-500">GMT+3</p>
             </div>
             <div className="w-full h-12 mt-2 opacity-20 bg-[repeating-linear-gradient(45deg,black,black_1px,transparent_1px,transparent_10px)] dark:bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_1px,transparent_10px)]"></div>
          </div>

          <div className="md:col-span-1 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
             <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <GraduationCap size={20} />
                <span className="text-xs font-mono">EDUCATION</span>
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">High School</h3>
                <p className="text-sm text-gray-500">9th Grade Student</p>
             </div>
             <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-gray-900 dark:bg-white h-full w-[25%] rounded-full"></div>
             </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-3 gap-4">
             <Link href="https://github.com/ncrz1337" target="_blank" className="flex items-center justify-center p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Github className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
             </Link>
             
             <Link href="https://x.com/ncrz1337" target="_blank" className="flex items-center justify-center p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Twitter className="text-gray-600 dark:text-gray-400 group-hover:text-blue-400 transition-colors" />
             </Link>
             
             <Link href="mailto:sercanking40@gmail.com" className="flex items-center justify-center p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Mail className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors" />
             </Link>
          </div>

        </main>
      </div>
    </>
  );
}