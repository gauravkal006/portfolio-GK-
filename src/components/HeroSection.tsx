import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { navItems, profile } from "../data/profile";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { onIntroDone } from "../lib/intro";
import { sunburstPath } from "./Motif";
import { HeroStage } from "./HeroStage";
import { HoloCard } from "./HoloCard";
import { PushButton } from "./PushButton";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const has = (sel: string) => root.current!.querySelector(sel) !== null;
        // Paused until the first-visit intro lifts (plays at once when there is no intro).
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out", duration: 1 } });
        tl.from("[data-hero='mast']", { autoAlpha: 0, y: -8, duration: 0.6 })
          .from("[data-hero='word']", { yPercent: 108, duration: 1.15, stagger: 0.1 }, 0.1)
          .from("[data-hero='fade']", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.8 }, 0.55)
          .from("[data-hero='strip']", { autoAlpha: 0, duration: 0.7 }, 0.9);

        if (has("[data-hero='sun']")) tl.from("[data-hero='sun']", { y: 70, duration: 1.8, ease: "power3.out" }, 0.55);
        if (has("[data-hero='portrait']")) tl.from("[data-hero='portrait']", { scale: 1.08, transformOrigin: "50% 40%", duration: 1.8, ease: "power3.out" }, 0.15);

        // The small moon drifts gently; the rays turn slowly via CSS.
        if (has("[data-hero='moon']")) gsap.to("[data-hero='moon']", { y: -10, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5 });
        const off = onIntroDone(() => tl.play());

        gsap.to("[data-hero='visual']", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative pt-[4.5rem] md:pt-20">
      <div className="container-page">
        <div data-hero="mast" className="label flex items-center justify-between gap-4 border-b border-ink py-3 !text-ink">
          <span>Portfolio · {new Date().getFullYear()}</span>
          <span className="hidden md:block">B.Tech Computer Science · PRMITR</span>
          <span>{profile.location}</span>
        </div>

        <div className="grid gap-14 pt-10 pb-12 md:pt-14 lg:pb-16 xl:grid-cols-12 xl:items-center xl:gap-8">
          <div className="flex flex-col xl:col-span-5">
            <p data-hero="fade" className="flex items-center gap-2.5 text-[0.9rem] text-muted">
              <span aria-hidden="true" className="size-2 rounded-full bg-olive" />
              Available for new opportunities
            </p>

            <h1 id="hero-title" className="display mt-6 text-[clamp(3.1rem,15vw,8.5rem)] leading-[0.88] md:text-[clamp(4rem,12vw,8.5rem)] xl:text-[clamp(3.8rem,6vw,6.75rem)]">
              <span className="sr-only">{profile.name}</span>
              <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
                <span data-hero="word" className="inline-block">Gaurav</span>
              </span>
              <span aria-hidden="true" className="block overflow-hidden pb-[0.12em] pl-[0.45em]">
                <span data-hero="word" className="inline-block italic text-accent [font-variation-settings:'SOFT'_100,'opsz'_144]">
                  Kalamkhede
                </span>
              </span>
            </h1>

            <div className="mt-8 grid max-w-3xl gap-5 md:grid-cols-2 md:gap-8 xl:grid-cols-1 xl:gap-5">
              <p data-hero="fade" className="display text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.16] tracking-[-0.015em]">
                {profile.statement} <em className="text-accent-ink">{profile.statementEm}</em>
              </p>
              <p data-hero="fade" className="text-[1.02rem] leading-relaxed text-muted lg:pt-1.5">
                {profile.intro}
              </p>
            </div>

            <div data-hero="fade" className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-5">
              <PushButton href="#projects" variant="primary">
                Explore my work <ArrowRight size={18} aria-hidden="true" className="arrow-r" />
              </PushButton>
              <PushButton href="#contact" variant="key">
                Get in touch <ArrowRight size={18} aria-hidden="true" className="arrow-r" />
              </PushButton>
              <PushButton href={profile.resume} download={profile.resumeFileName} variant="key">
                Résumé <span className="font-mono text-[0.84rem] text-muted">PDF</span>
                <Download size={17} aria-hidden="true" className="arrow-d" />
              </PushButton>
            </div>
          </div>

          <div data-hero="visual" className="xl:col-span-7">
            <HeroStage>{profile.photo ? <HoloCard /> : <HeroArt />}</HeroStage>
          </div>
        </div>

        <nav
          data-hero="strip"
          aria-label="Contents"
          className="hidden items-center gap-8 border-t border-ink py-4 md:flex"
        >
          <span className="label !text-ink">Contents</span>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[0.92rem]">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="group inline-flex items-baseline gap-1.5 text-ink transition-colors hover:text-accent-ink">
                  <span className="font-mono text-[0.8rem] text-muted transition-colors group-hover:text-accent-ink">{item.index}</span>
                  <span className="link-underline">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#about" className="ml-auto inline-flex min-h-11 items-center gap-2 text-[0.85rem] text-muted transition-colors hover:text-ink">
            Scroll <ArrowDown size={15} aria-hidden="true" className="motion-safe:animate-bounce [animation-duration:2.4s]" />
          </a>
        </nav>
      </div>
    </section>
  );
}

const rays = sunburstPath(36, 340, 200, 330);

/** Arch-framed cover illustration: the profile photo when one is set, otherwise a geometric sunrise. */
function HeroArt() {
  const [failed, setFailed] = useState(false);
  const photo = profile.photo && !failed ? profile.photo : null;

  return (
    <svg
      viewBox="0 0 400 500"
      className="block h-auto w-full"
      {...(photo ? { role: "img", "aria-label": `Portrait of ${profile.name}` } : { "aria-hidden": true })}
    >
      <defs>
        <clipPath id="hero-arch">
          <path d="M20 500V200a180 180 0 0 1 360 0v300z" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-arch)">
        <rect width="400" height="500" fill="var(--color-paper-2)" />
        {photo ? (
          <image
            data-hero="portrait"
            href={photo}
            x="20"
            y="20"
            width="360"
            height="480"
            preserveAspectRatio="xMidYMid slice"
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <path d={rays} fill="var(--color-mustard)" fillOpacity="0.42" className="sun-spin" />
            <g data-hero="sun">
              <circle cx="200" cy="330" r="104" fill="var(--color-accent)" />
              {[
                [344, 4],
                [366, 6],
                [390, 8],
                [416, 10],
              ].map(([y, h]) => (
                <rect key={y} x="80" y={y} width="240" height={h} fill="var(--color-paper-2)" />
              ))}
            </g>
            <path d="M20 428c60-34 120-36 190-8s120 14 170-6v86H20z" fill="var(--color-olive)" />
            <path d="M20 466c90-22 210-26 360 4v30H20z" fill="var(--color-ink)" />
          </>
        )}
      </g>

      <path d="M20 500V200a180 180 0 0 1 360 0v300" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
      <circle data-hero="moon" cx="352" cy="58" r="13" fill="var(--color-mustard)" />
    </svg>
  );
}
