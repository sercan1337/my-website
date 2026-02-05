"use client";

import Link from "next/link";
import { FileX, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full relative flex items-center justify-center p-4 pb-24 font-mono overflow-hidden">
        
        <main className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 transition-colors">
          
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 transition-colors">
             <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#161b22] rounded-t-md text-sm text-yellow-600 dark:text-yellow-500 border-t-2 border-yellow-500 transition-colors">
                   <FileX size={14} />
                   <span>404.tsx</span>
                   <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">x</span>
                </div>
             </div>
          </div>

          <div className="p-6 overflow-x-auto bg-white dark:bg-[#161b22] transition-colors">
             <div className="flex text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-300">
                
                <div className="flex flex-col text-right text-gray-300 dark:text-gray-600 select-none pr-4 border-r border-gray-200 dark:border-gray-800 mr-4 font-mono transition-colors">
                   <span>1</span>
                   <span>2</span>
                   <span>3</span>
                   <span>4</span>
                   <span>5</span>
                   <span>6</span>
                   <span>7</span>
                   <span>8</span>
                   <span>9</span>
                   <span>10</span>
                   <span>11</span>
                   <span>12</span>
                   <span>13</span>
                   <span>14</span>
                </div>

                <div className="font-mono w-full">
                   <div>
                      <span className="text-purple-600 dark:text-pink-400">import</span>{" "}
                      <span className="text-blue-600 dark:text-blue-400">{"{ Link }"}</span>{" "}
                      <span className="text-purple-600 dark:text-pink-400">from</span>{" "}
                      <span className="text-green-600 dark:text-green-400">&quot;next/link&quot;</span>;
                   </div>
                   <div className="h-6"></div>
                   
                   <div>
                      <span className="text-purple-600 dark:text-pink-400">export default function</span>{" "}
                      <span className="text-amber-600 dark:text-yellow-300">NotFound</span>() {"{"}
                   </div>
                   
                   <div className="pl-6">
                      <span className="text-purple-600 dark:text-pink-400">const</span>{" "}
                      <span className="text-sky-600 dark:text-blue-300">error</span> = {"{"}
                   </div>
                   <div className="pl-12">
                      <span className="text-sky-600 dark:text-blue-300">code</span>: <span className="text-violet-600 dark:text-purple-400">404</span>,
                   </div>
                   <div className="pl-12">
                      <span className="text-sky-600 dark:text-blue-300">message</span>: <span className="text-green-600 dark:text-green-400">&quot;Page not found in directory.&quot;</span>
                   </div>
                   <div className="pl-6">{"};"}</div>
                   
                   <div className="h-6"></div>

                   <div className="pl-6">
                      <span className="text-purple-600 dark:text-pink-400">return</span> (
                   </div>
                   
                   <div className="pl-12">
                      <span className="text-gray-400 dark:text-gray-500">{"// Return to safety"}</span>
                   </div>
                   <div className="pl-12">
                      <span className="text-blue-600 dark:text-blue-400">{"<Link"}</span> <span className="text-sky-600 dark:text-blue-300">href</span>=<span className="text-green-600 dark:text-green-400">&quot;/&quot;</span><span className="text-blue-600 dark:text-blue-400">{">"}</span>
                   </div>
                   
                   <div className="pl-16">
                      <Link href="/">
                        <span className="text-gray-900 dark:text-white border-b border-dashed border-gray-400 dark:border-gray-600 pb-0.5 hover:text-green-600 dark:hover:text-green-400 hover:border-green-600 dark:hover:border-green-400 transition-colors cursor-pointer">
                          Go back home
                        </span>
                      </Link>
                   </div>
                   
                   <div className="pl-12">
                      <span className="text-blue-600 dark:text-blue-400">{"</Link>"}</span>
                   </div>
                   
                   <div>{"}"}</div>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] p-4 font-mono text-sm transition-colors">
             <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2 text-xs uppercase tracking-wider">
                <Terminal size={12} />
                <span>Terminal Output</span>
             </div>
             <div className="text-red-600 dark:text-red-400">
                Error: Module not found: Can&apos;t resolve requested URL.
             </div>
             <div className="text-gray-600 dark:text-gray-500 mt-1">
                at path: <span className="text-amber-600 dark:text-yellow-500/80">src/app/unknown-route/page.tsx</span>
             </div>
          </div>

        </main>
      </div>
  );
}