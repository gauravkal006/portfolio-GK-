import { useRef, useState } from "react";
import { profile } from "../data/profile";
import { gsap, PRELOAD_EXIT, PRELOAD_HOLD, prefersReducedMotion, useGSAP } from "../lib/gsap";

/** Brief (0.5 s) branded loader that lifts away to reveal the hero. Skipped for reduced motion. */
export function Preloader() {
  const [done, setDone] = useState(() => prefersReducedMotion());
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (done) return;
      document.documentElement.style.overflow = "hidden";
      const release = () => {
        document.documentElement.style.overflow = "";
      };
      gsap
        .timeline({
          onComplete: () => {
            release();
            setDone(true);
          },
        })
        .from("[data-pl='mark']", { autoAlpha: 0, y: 12, duration: 0.25, ease: "power2.out" }, 0)
        .fromTo("[data-pl='bar']", { scaleX: 0 }, { scaleX: 1, duration: PRELOAD_HOLD, ease: "power2.inOut" }, 0)
        .to("[data-pl='inner']", { autoAlpha: 0, y: -10, duration: 0.2, ease: "power2.in" }, PRELOAD_HOLD)
        .to(root.current, { yPercent: -100, duration: PRELOAD_EXIT, ease: "power4.inOut" }, PRELOAD_HOLD);
      // Safety net: never let the loader block the page if the timeline stalls.
      const fallback = window.setTimeout(() => {
        release();
        setDone(true);
      }, 2000);
      return () => {
        window.clearTimeout(fallback);
        release();
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[100] grid place-items-center bg-bg">
      <div data-pl="inner" className="flex flex-col items-center gap-5">
        <span
          data-pl="mark"
          className="grid size-16 place-items-center rounded-2xl border border-accent/40 bg-accent/5 font-display text-xl font-semibold text-accent shadow-[0_0_40px_rgb(94_224_255/0.15)]"
        >
          {profile.initials}
        </span>
        <span className="h-px w-32 overflow-hidden bg-line-strong">
          <span data-pl="bar" className="block h-full w-full origin-left bg-accent" />
        </span>
      </div>
    </div>
  );
}
