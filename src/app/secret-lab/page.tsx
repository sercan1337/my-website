"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SecretLabPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUnlocked(window.localStorage.getItem("sercan-mode-unlocked") === "true");
    };

    sync();
    window.addEventListener("sercan-mode-unlocked", sync);
    return () => window.removeEventListener("sercan-mode-unlocked", sync);
  }, []);

  if (!unlocked) {
    return (
      <section className="secret-locked">
        <div className="system-window max-w-xl">
          <div className="system-titlebar">
            <span>ACCESS DENIED</span>
            <span>LOCKED</span>
          </div>
          <div className="system-content">
            <h1 className="text-3xl font-bold">Secret Lab is encrypted.</h1>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Enter the old controller sequence from anywhere on the site to
              unlock this directory.
            </p>
            <p className="mt-6 text-xs text-white/50">
              hint: up up down down left right left right b a
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>SECRET LAB</span>
          <span>SERCAN MODE</span>
        </div>
        <div className="system-content">
          <h1 className="text-3xl font-bold sm:text-5xl">Unlocked directory</h1>
          <div className="boot-log mt-6">
            <p>{"> cheat code accepted"}</p>
            <p>{"> alternate terminal palette loaded"}</p>
            <p>{"> experimental files mounted"}</p>
            <p>{"> welcome to the weird part of the disk"}</p>
          </div>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>LAB FILES</span>
          <span>UNSTABLE</span>
        </div>
        <div>
          {[
            ["dream-machine.txt", "Ideas that are too early to explain."],
            ["tiny-game.rom", "A placeholder for a future browser toy."],
            ["notes-from-the-backroom.md", "Private experiments and strange UI thoughts."],
          ].map(([name, desc]) => (
            <div key={name} className="file-row">
              <span>{name}</span>
              <span className="text-white/62">{desc}</span>
              <span>hidden</span>
            </div>
          ))}
        </div>
      </section>

      <Link href="/" className="retro-command w-fit p-3">
        return home
      </Link>
    </div>
  );
}
