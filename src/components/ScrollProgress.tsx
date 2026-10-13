import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const setScale = gsap.quickSetter(bar.current, "scaleX");
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScale(self.progress),
    });
  });

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent via-accent to-accent-2"
    />
  );
}
