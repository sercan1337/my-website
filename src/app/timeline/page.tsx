import Link from "next/link";
import { timelineData } from "@/data/timeline";

export const metadata = {
  title: "Timeline | Sercan Duran",
  description: "Boot log archive.",
};

export default function TimelinePage() {
  return (
    <div className="grid gap-6 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>BOOTLOG ARCHIVE</span>
          <span>LEGACY ROUTE</span>
        </div>
        <div className="system-content">
          <h1 className="text-3xl font-bold sm:text-5xl">Timeline log</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            This route remains available as an archive. The same information is
            mounted inside the About system screen.
          </p>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>events.log</span>
          <span>{timelineData.length} records</span>
        </div>
        <div className="system-content">
          <ol className="directory-tree">
            {timelineData.map((item) => (
              <li key={`${item.year}-${item.title}`}>
                <span className="text-[#9c7cff]">{item.year}</span>
                <strong className="ml-3">{item.title}</strong>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-white/68">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Link href="/about" className="retro-command w-fit p-3">
        run sysinfo
      </Link>
    </div>
  );
}
