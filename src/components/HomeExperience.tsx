"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type HomePost = {
  slug: string;
  title: string;
  date: string;
  readTime: number;
};

const asciiLogo = String.raw`
  _____ _____ ____   ____    _    _   _
 / ____| ____|  _ \ / ___|  / \  | \ | |
 \___ \|  _| | |_) | |     / _ \ |  \| |
  ___) | |___|  _ <| |___ / ___ \| |\  |
 |____/|_____|_| \_\\____/_/   \_\_| \_|
`;

export default function HomeExperience({ posts }: { posts: HomePost[] }) {
  const [continued, setContinued] = useState(false);

  useEffect(() => {
    const onKeyDown = () => setContinued(true);
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="grid gap-8 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>SERCAN_BOOT.EXE</span>
          <span>MEM OK</span>
        </div>
        <div className="system-content grid gap-8">

          <pre className="ascii-logo" aria-label="Sercan ASCII logo">
            {asciiLogo}
          </pre>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold sm:text-5xl">
              Personal website as a bootable artifact.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
              I write about coding, machine learning, and building things while
              learning how systems work from the inside.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="system-window">
          <div className="system-titlebar">
            <span>SYSTEM STATUS</span>
            <span>ONLINE</span>
          </div>
          <div className="system-content">
            <div className="boot-log">
              <p>{"> user: sercan1337"}</p>
              <p>{"> mode: build_to_understand"}</p>
              <p>{"> posts indexed: 0005"}</p>
              <p>{"> active project: novus"}</p>
            </div>
          </div>
        </div>

        <div className="system-window">
          <div className="system-titlebar">
            <span>COMMANDS</span>
            <span>{continued ? "READY" : "WAITING"}</span>
          </div>
          <div className="system-content grid gap-3 sm:grid-cols-2">
            {[
              ["/blog", "open posts.dir"],
              ["/projects", "open projects.dir"],
              ["/about", "run sysinfo"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="retro-command p-3">
                <span>{label}</span>
                <ArrowRight className="ml-auto inline h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>RECENT FILES</span>
          <span>*.MD</span>
        </div>
        <div>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="file-row">
              <span>{post.title}</span>
              <span>{post.date}</span>
              <span>{post.readTime} min</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
