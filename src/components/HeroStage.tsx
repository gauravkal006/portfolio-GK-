import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { heroFacts, heroQuote, type HeroFact } from "../data/profile";
import { useIntroDone } from "../lib/intro";
import { Glyph } from "./Motif";

const spring = { type: "spring", stiffness: 220, damping: 20 } as const;

const centre: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { ...spring, delay: 0.1 } },
};
const quote: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const fact: Variants = {
  hidden: (c: { side: "left" | "right" }) => ({ opacity: 0, scale: 0.8, x: c.side === "left" ? -44 : 44 }),
  show: (c: { side: "left" | "right"; i: number }) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { ...spring, delay: (c.side === "left" ? 0.75 : 0.95) + c.i * 0.13 },
  }),
};

/** A small floating card with one fact. Bobs gently on its own and leans toward you on hover. */
function FactCard({ item, side, i, className = "" }: { item: HeroFact; side: "left" | "right"; i: number; className?: string }) {
  return (
    <motion.li
      custom={{ side, i }}
      variants={fact}
      whileHover={{ y: -6, scale: 1.03, rotate: side === "left" ? -1.5 : 1.5, transition: spring }}
      className={`relative z-10 ${className}`}
    >
      <div className="fact-float" style={{ animationDelay: `${(side === "left" ? 0 : -2.2) - i * 1.4}s` }}>
        <div className="fact-face">
          <p className="flex items-center gap-2 font-mono text-[0.72rem] tracking-[0.08em] text-muted uppercase">
            <Glyph shape={item.glyph} className="size-2.5 shrink-0" />
            {item.label}
          </p>
          <p className="mt-1.5 font-serif text-[1.12rem] leading-tight">{item.value}</p>
          <p className="mt-0.5 text-[0.82rem] leading-snug text-muted">{item.sub}</p>
        </div>
      </div>
    </motion.li>
  );
}

/**
 * Hero centrepiece. After the intro: the profile card arrives first, the quote settles above it,
 * then fact cards pop out on the left and then the right. On wide screens the cards flank the
 * profile card; on smaller screens they sit in a grid beneath it.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const ready = useIntroDone();
  const state = ready ? "show" : "hidden";

  return (
    <motion.div initial="hidden" animate={state} className="relative">
      <motion.figure variants={quote} className="mx-auto mb-7 max-w-sm text-center">
        <span aria-hidden="true" className="block font-serif text-[3rem] leading-[0.6] text-accent">“</span>
        <blockquote className="mt-1 font-serif text-[1.2rem] leading-snug italic">{heroQuote.text}</blockquote>
        <figcaption className="label mt-2">— {heroQuote.author}</figcaption>
      </motion.figure>

      {/* Cards sit beside the profile card with a clear gap, never over the photo. */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_15rem_minmax(0,1fr)] xl:items-center xl:gap-x-7 2xl:grid-cols-[minmax(0,1fr)_16.5rem_minmax(0,1fr)]">
        <ul aria-label="About me" className="hidden flex-col gap-5 xl:flex">
          {heroFacts.left.map((item, i) => (
            <FactCard key={item.label} item={item} side="left" i={i} className={i === 1 ? "translate-x-2" : "-translate-x-1"} />
          ))}
        </ul>

        <motion.div variants={centre} className="relative z-0 mx-auto w-full max-w-[17rem] xl:max-w-none">
          {children}
        </motion.div>

        <ul aria-label="What I work on" className="hidden flex-col gap-5 pt-8 xl:flex">
          {heroFacts.right.map((item, i) => (
            <FactCard key={item.label} item={item} side="right" i={i} className={i === 1 ? "-translate-x-2" : "translate-x-1"} />
          ))}
        </ul>
      </div>

      {/* Smaller screens: the same cards in a grid under the profile card. */}
      <ul aria-label="About me" className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 xl:hidden">
        {[...heroFacts.left.map((item) => ["left", item] as const), ...heroFacts.right.map((item) => ["right", item] as const)].map(([side, item], i) => (
          <FactCard key={item.label} item={item} side={side} i={i % 3} />
        ))}
      </ul>
    </motion.div>
  );
}
