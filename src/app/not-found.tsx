"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX, Terminal } from "lucide-react";

export default function NotFound() {
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

      <div className="min-h-screen w-full relative bg-white dark:bg-gray-950 transition-colors duration-500 flex items-center justify-center p-4 font-mono">
        
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 w-[200%] h-[200%] -top-10 -left-10 
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
            animate-grid"
            style={{ backgroundSize: '30px 30px' }}>
          </div>
          <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,black)] dark:bg-gray-950"></div>
        </div>

        <main className="relative z-10 w-full max-w-3xl bg-[#161b22] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-gray-800">
             <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-[#161b22] rounded-t-md text-sm text-yellow-500 border-t-2 border-yellow-500">
                   <FileX size={14} />
                   <span>404.tsx</span>
                   <span className="text-gray-500 text-xs ml-2">x</span>
                </div>
             </div>
          </div>

          <div className="p-6 overflow-x-auto bg-[#161b22]">
             <div className="flex text-sm sm:text-base leading-relaxed text-gray-300">
                
                <div className="flex flex-col text-right text-gray-600 select-none pr-4 border-r border-gray-800 mr-4 font-mono">
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

                <div className="font-mono">
                   <div>
                      <span className="text-pink-400">import</span>{" "}
                      <span className="text-blue-400">{"{ Link }"}</span>{" "}
                      <span className="text-pink-400">from</span>{" "}
                      <span className="text-green-400">&quot;next/link&quot;</span>;
                   </div>
                   <div className="h-6"></div>
                   
                   <div>
                      <span className="text-pink-400">export default function</span>{" "}
                      <span className="text-yellow-300">NotFound</span>() {"{"}
                   </div>
                   
                   <div className="pl-6">
                      <span className="text-pink-400">const</span>{" "}
                      <span className="text-blue-300">error</span> = {"{"}
                   </div>
                   <div className="pl-12">
                      <span className="text-blue-300">code</span>: <span className="text-purple-400">404</span>,
                   </div>
                   <div className="pl-12">
                      <span className="text-blue-300">message</span>: <span className="text-green-400">&quot;Page not found in directory.&quot;</span>
                   </div>
                   <div className="pl-6">{"};"}</div>
                   
                   <div className="h-6"></div>

                   <div className="pl-6">
                      <span className="text-pink-400">return</span> (
                   </div>
                   
                   <div className="pl-12">
                      <span className="text-gray-500">{"// Return to safety"}</span>
                   </div>
                   <div className="pl-12">
                      <span className="text-blue-400">{"<Link"}</span> <span className="text-blue-300">href</span>=<span className="text-green-400">&quot;/&quot;</span><span className="text-blue-400">{">"}</span>
                   </div>
                   <div className="pl-16">
                      <span className="text-white border-b border-dashed border-gray-600 pb-0.5 hover:text-green-400 hover:border-green-400 transition-colors cursor-pointer">
                        Go back home
                      </span>
                   </div>
                   <div className="pl-12">
                      <span className="text-blue-400">{"</Link>"}</span>
                   </div>
                   
                   <div>{"}"}</div>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-800 bg-[#0d1117] p-4 font-mono text-sm">
             <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs uppercase tracking-wider">
                <Terminal size={12} />
                <span>Terminal Output</span>
             </div>
             <div className="text-red-400">
                Error: Module not found: Can&apos;t resolve requested URL.
             </div>
             <div className="text-gray-500 mt-1 mb-4">
                at path: <span className="text-yellow-500/80">src/app/unknown-route/page.tsx</span>
             </div>
             
             <Link href="/">
                 <Button className="bg-green-600 hover:bg-green-700 text-white font-mono h-9 text-sm px-4">
                     <ArrowLeft size={16} className="mr-2" />
                     cd /home
                 </Button>
             </Link>
          </div>

        </main>
      </div>
    </>
  );
}