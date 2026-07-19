"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const STORAGE_KEY = "sercan-mode-unlocked";
const MODE_CLASS = "sercan-mode";

export default function KonamiCode() {
  const pathname = usePathname();
  const sequenceIndexRef = useRef(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === "true") {
      document.documentElement.classList.add(MODE_CLASS);
    }
  }, []);

  useEffect(() => {
    const playUnlockSound = () => {
      try {
        const BrowserAudioContext =
          window.AudioContext ||
          (window as typeof window & {
            webkitAudioContext?: typeof window.AudioContext;
          })
            .webkitAudioContext;

        if (!BrowserAudioContext) return;

        const context = new BrowserAudioContext();
        const notes = [523.25, 659.25, 783.99];

        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "square";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.04, context.currentTime + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + index * 0.08 + 0.12
          );
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(context.currentTime + index * 0.08);
          oscillator.stop(context.currentTime + index * 0.08 + 0.13);
        });
      } catch {
      }
    };

    const unlockSercanMode = () => {
      document.documentElement.classList.add(MODE_CLASS);
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.dispatchEvent(new Event("sercan-mode-unlocked"));
      playUnlockSound();
      setShowOverlay(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTextInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTextInput || pathname === "/1337") {
        sequenceIndexRef.current = 0;
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const sequenceIndex = sequenceIndexRef.current;
      const expectedKey = KONAMI_SEQUENCE[sequenceIndex];

      if (key === expectedKey) {
        const nextIndex = sequenceIndex + 1;

        if (nextIndex === KONAMI_SEQUENCE.length) {
          unlockSercanMode();
          sequenceIndexRef.current = 0;
          return;
        }

        sequenceIndexRef.current = nextIndex;
        return;
      }

      sequenceIndexRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname]);

  if (!showOverlay) return null;

  return (
    <div className="konami-notice" role="status" aria-live="polite">
      <div className="konami-notice__panel">
        <button
          type="button"
          className="konami-notice__close"
          onClick={() => setShowOverlay(false)}
          aria-label="Dismiss Konami notification"
        >
          x
        </button>
        <div className="konami-notice__title">SERCAN BIOS v1.337</div>
        <div className="konami-notice__lines">
          <span>{"> sequence matched"}</span>
          <strong>{"> hidden terminal unlocked"}</strong>
          <Link href="/1337" onClick={() => setShowOverlay(false)}>
            enter /1337
          </Link>
        </div>
      </div>
    </div>
  );
}
