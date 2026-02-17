import Timeline from "@/components/Timeline";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Timeline | Sercan Duran",
  description: "My journey.",
};

export default function TimelinePage() {
  return (
    <main className="min-h-screen w-full text-zinc-900 dark:text-white px-6 py-9 transition-colors duration-300">
      
      <div className="max-w-3xl mx-auto mb-16">
        <Link 
          href="/" 
          className="inline-flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6 text-sm group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Timeline
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Step by step progress.
        </p>
      </div>

      <Timeline />
    </main>
  );
}