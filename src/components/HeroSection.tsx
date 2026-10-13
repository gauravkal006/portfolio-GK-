import { useRef } from "react";
import { ArrowDown, Download, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { finePointer, gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

const nameLines = ["Gaurav", "Kalamkhede"];

// Syntax-highlighted snapshot of verified profile facts.
const S = ({ c, children }: { c: string; children: React.ReactNode }) => <span className={c}>{children}</span>;
const str = "text-lime/90";
const key = "text-ink";
const pun = "text-subtle";
const codeLines: React.ReactNode[] = [
  <S c="italic text-subtle">// building for the bright side</S>,
  <><S c="text-accent-2">const</S> <S c="text-accent">gaurav</S> <S c={pun}>=</S> <S c={pun}>{"{"}</S></>,
  <>&nbsp;&nbsp;<S c={key}>role</S><S c={pun}>:</S> <S c={str}>"Full-Stack Developer"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>studying</S><S c={pun}>:</S> <S c={str}>"B.Tech CSE @ PRMITR"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>based</S><S c={pun}>:</S> <S c={str}>"Amravati, IN"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>stack</S><S c={pun}>: [</S><S c={str}>"Java"</S><S c={pun}>,</S> <S c={str}>"Spring Boot"</S><S c={pun}>,</S> <S c={str}>"React"</S><S c={pun}>],</S></>,
  <>&nbsp;&nbsp;<S c={key}>exploring</S><S c={pun}>: [</S><S c={str}>"RAG"</S><S c={pun}>,</S> <S c={str}>"OCR"</S><S c={pun}>,</S> <S c={str}>"Azure"</S><S c={pun}>],</S></>,
  <>&nbsp;&nbsp;<S c={key}>recent</S><S c={pun}>: [</S><S c={str}>"Validify"</S><S c={pun}>,</S> <S c={str}>"DocBlendAI"</S><S c={pun}>],</S></>,
  <S c={pun}>{"};"}</S>,
];

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
        tl.from("[data-hero='eyebrow']", { autoAlpha: 0, y: 14, duration: 0.7 })
          .from("[data-hero='word']", { yPercent: 115, duration: 1.1, stagger: 0.09 }, "-=0.4")
          .from("[data-hero='fade']", { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.8 }, "-=0.7")
          .from("[data-hero='panel']", { autoAlpha: 0, y: 40, scale: 0.97, duration: 1.2 }, 0.35)
          .from("[data-hero='line']", { autoAlpha: 0, x: -10, stagger: 0.05, duration: 0.5, ease: "power2.out" }, 0.8)
          .from("[data-hero='chip']", { autoAlpha: 0, scale: 0.85, stagger: 0.12, duration: 0.6, ease: "back.out(2)" }, 1.2)
          .from("[data-hero='scroll']", { autoAlpha: 0, duration: 0.6 }, 1.4);

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((chip, i) => {
          gsap.to(chip, { y: i % 2 ? 8 : -8, duration: 3 + i * 0.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.8 });
        });

        // Fade the scroll cue and ease the visual upward as the hero leaves.
        gsap.to("[data-hero='scroll']", {
          autoAlpha: 0,
          scrollTrigger: { trigger: root.current, start: "top top", end: "20% top", scrub: true },
        });
        gsap.to("[data-hero='visual']", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // Typing role cycle, written straight to the DOM so React does not re-render each character.
        const el = roleRef.current;
        if (el) {
          let index = 0;
          const cycle = () => {
            const current = profile.roles[index];
            index = (index + 1) % profile.roles.length;
            const next = profile.roles[index];
            const erase = { n: current.length };
            const type = { n: 0 };
            gsap
              .timeline({ onComplete: () => void gsap.delayedCall(1.8, cycle) })
              .to(erase, { n: 0, duration: current.length * 0.022, ease: "none", onUpdate: () => void (el.textContent = current.slice(0, Math.ceil(erase.n))) })
              .to(type, { n: next.length, duration: next.length * 0.045, ease: "none", onUpdate: () => void (el.textContent = next.slice(0, Math.ceil(type.n))) }, "+=0.15");
          };
          gsap.delayedCall(2.6, cycle);
        }

        // Restrained pointer parallax on desktop.
        if (finePointer()) {
          const panel = root.current?.querySelector<HTMLElement>("[data-hero='tilt']");
          if (panel) {
            const rx = gsap.quickTo(panel, "rotationX", { duration: 0.8, ease: "power3.out" });
            const ry = gsap.quickTo(panel, "rotationY", { duration: 0.8, ease: "power3.out" });
            const chips = gsap.utils.toArray<HTMLElement>("[data-hero='chip']").map((chip) => ({
              x: gsap.quickTo(chip, "x", { duration: 1, ease: "power3.out" }),
              y: gsap.quickTo(chip, "y", { duration: 1, ease: "power3.out" }),
            }));
            const onMove = (event: PointerEvent) => {
              const px = event.clientX / window.innerWidth - 0.5;
              const py = event.clientY / window.innerHeight - 0.5;
              rx(-py * 6);
              ry(px * 8);
              chips.forEach((c, i) => {
                c.x(px * (14 + i * 8));
                c.y(py * (14 + i * 8));
              });
            };
            const onLeave = () => {
              rx(0);
              ry(0);
            };
            const section = root.current!;
            section.addEventListener("pointermove", onMove);
            section.addEventListener("pointerleave", onLeave);
            return () => {
              section.removeEventListener("pointermove", onMove);
              section.removeEventListener("pointerleave", onLeave);
            };
          }
        }
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <div className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
        <div>
          <p data-hero="eyebrow" className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pr-3.5 pl-3 text-[0.8rem] text-muted">
            <span className="relative flex size-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-lime" />
              <span className="relative size-2 rounded-full bg-lime" />
            </span>
            Available for new opportunities
          </p>

          <h1 id="hero-title" className="mt-7 text-[clamp(2.9rem,10.5vw,6.25rem)] lg:text-[clamp(4rem,6.6vw,6.25rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
            <span className="sr-only">{profile.name}</span>
            {nameLines.map((line, i) => (
              <span key={line} aria-hidden="true" className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span data-hero="word" className={`inline-block ${i === 1 ? "bg-gradient-to-r from-ink via-ink to-accent bg-clip-text text-transparent" : ""}`}>
                  {line}
                  {i === 1 && <span className="text-accent">.</span>}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero="fade" className="mt-6 flex min-h-[1.6em] items-center font-mono text-[clamp(0.95rem,2.2vw,1.15rem)] text-accent">
            <span aria-hidden="true" className="mr-2 text-subtle">&gt;</span>
            <span className="sr-only">{profile.title}</span>
            <span ref={roleRef} aria-hidden="true">{profile.roles[0]}</span>
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-px bg-accent" />
          </p>

          <p data-hero="fade" className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-muted sm:text-[1.1rem]">
            {profile.intro}
          </p>

          <div data-hero="fade" className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              View projects <ArrowDown size={17} aria-hidden="true" className="arrow-d" />
            </a>
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-ghost">
              <Download size={16} aria-hidden="true" className="arrow-d" /> Download resume
            </a>
          </div>

          <ul data-hero="fade" className="mt-8 flex items-center gap-1 text-muted" aria-label="Profiles">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-white/5 hover:text-ink" aria-label="GitHub (opens in a new tab)">
                <GitHubIcon size={17} /> GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-white/5 hover:text-ink" aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon size={17} /> LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-white/5 hover:text-ink">
                <Mail size={17} aria-hidden="true" /> Email
              </a>
            </li>
          </ul>
        </div>

        <div data-hero="visual" className="relative mx-auto w-full max-w-[34rem] [perspective:1200px]" aria-hidden="true">
          <div data-hero="panel">
            <div data-hero="tilt" className="panel overflow-hidden shadow-[0_40px_120px_-40px_rgb(94_224_255/0.25)] [transform-style:preserve-3d]">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="ml-3 rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[0.72rem] text-muted">gaurav.ts</span>
              </div>
              <pre className="overflow-hidden px-4 py-5 font-mono text-[clamp(0.6rem,2.9vw,0.84rem)] leading-[1.9] sm:px-5">
                {codeLines.map((line, i) => (
                  <div key={i} data-hero="line" className="flex whitespace-pre">
                    <span className="mr-4 hidden w-4 shrink-0 text-right text-subtle/60 select-none sm:inline-block">{i + 1}</span>
                    <span className="min-w-0">{line}</span>
                  </div>
                ))}
              </pre>
              <div className="flex items-center border-t border-line px-4 py-2 font-mono text-[0.68rem] text-subtle">
                <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-lime" /> main</span>
              </div>
            </div>
          </div>

          <div data-hero="chip" className="absolute -top-5 left-4 sm:-left-5">
            <div data-float className="rounded-xl border border-line-strong bg-surface-2/90 px-3.5 py-2 font-mono text-[0.72rem] text-ink shadow-xl backdrop-blur-md">
              <span className="text-accent">●</span> Java · Spring Boot
            </div>
          </div>
          <div data-hero="chip" className="absolute -bottom-5 right-4 sm:-right-5">
            <div data-float className="rounded-xl border border-line-strong bg-surface-2/90 px-3.5 py-2 font-mono text-[0.72rem] text-ink shadow-xl backdrop-blur-md">
              <span className="text-accent-2">●</span> RAG · OCR · LLM
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        data-hero="scroll"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] tracking-[0.2em] text-subtle uppercase transition-colors hover:text-ink md:flex"
      >
        <span className="flex h-9 w-5.5 justify-center rounded-full border border-line-strong pt-1.5">
          <span className="scroll-dot size-1 rounded-full bg-accent" />
        </span>
        Scroll
      </a>
    </section>
  );
}
