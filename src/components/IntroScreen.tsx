import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "../data/profile";
import { finishIntro, introPlays } from "../lib/intro";
import { Sunburst } from "./Motif";

const DURATION = 1000; // ms the loading screen holds before the curtain lifts
const curtain = [0.76, 0, 0.24, 1] as const;

/**
 * First-visit loading screen (~1 s): a turning sunburst behind the monogram, the name writing
 * itself in and a 0–100 counter, then the screen lifts like a curtain to reveal the hero.
 */
export function IntroScreen() {
  const [visible, setVisible] = useState(introPlays);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!introPlays) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      if (countRef.current) countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const lift = () => {
      setVisible(false);
      finishIntro();
    };
    // Timers, not rAF, decide when to lift, so a throttled tab can never keep the page covered.
    const timer = window.setTimeout(lift, DURATION + 80);
    const safety = window.setTimeout(() => {
      root.style.overflow = "";
      lift();
    }, 3000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearTimeout(safety);
    };
  }, []);

  const letters = profile.name.split("");

  return (
    <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex flex-col bg-bg text-ink"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.75, ease: curtain } }}
        >
          <div className="container-page flex items-center justify-between pt-6">
            <span className="label !text-ink">Portfolio · {new Date().getFullYear()}</span>
            <span className="label">{profile.location}</span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-7">
            <div className="relative grid size-40 place-items-center">
              <motion.div
                className="absolute inset-0 text-mustard"
                initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                animate={{ opacity: 0.5, scale: 1, rotate: 30 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Sunburst rays={32} core={false} className="size-full" />
              </motion.div>
              <motion.span
                className="nav-coin relative !size-20 !text-[2.1rem]"
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              >
                gk
              </motion.span>
            </div>

            <p className="display flex overflow-hidden text-[clamp(1.8rem,5vw,3rem)] leading-tight" aria-hidden="true">
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  className={i > profile.firstName.length ? "italic text-accent" : ""}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </p>

            <div className="h-px w-52 overflow-hidden bg-line">
              <motion.div
                className="h-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION / 1000, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>

          <div className="container-page flex items-end justify-between pb-6">
            <span className="label">Full-stack · AI/ML</span>
            <span className="display text-[3rem] leading-none tabular-nums">
              <span ref={countRef}>000</span>
              <span className="text-accent">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
