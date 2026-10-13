import { useRef, useState } from "react";
import { profile } from "../data/profile";
import { finePointer, gsap, MOTION_OK, useGSAP } from "../lib/gsap";

/**
 * Portrait card for the About section. Shows `profile.photo` when it is set and loads;
 * otherwise falls back to the GK monogram so the layout never shows a broken image.
 */
type Props = {
  /** Play the masked scroll reveal (off when a parent timeline animates the card). */
  reveal?: boolean;
  /** Load eagerly when the card is above the fold. */
  priority?: boolean;
};

export function ProfilePhoto({ reveal = true, priority = false }: Props) {
  const [failed, setFailed] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const showPhoto = Boolean(profile.photo) && !failed;

  // Masked reveal on scroll, plus a gentle tilt toward the pointer on desktop.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = frame.current!;
        if (reveal) {
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 14% 14% 14% round 24px)" },
            { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } },
          );
          gsap.from(el.querySelector("[data-photo-inner]"), {
            scale: 1.18,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        }

        if (!finePointer()) return;
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: frame, dependencies: [reveal] },
  );

  return (
    <figure className="relative mx-auto w-[calc(100%-0.75rem)] max-w-[19rem] sm:max-w-[22rem] md:mx-0 lg:max-w-none [perspective:1000px]">
      {/* Offset outline behind the card */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl sm:translate-x-3 sm:translate-y-3 border border-accent/25" />

      <div ref={frame} className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line-strong bg-surface-2 [transform-style:preserve-3d]">
        <div data-photo-inner className="absolute inset-0">
          {showPhoto ? (
            <img
              src={profile.photo!}
              alt={`Portrait of ${profile.name}`}
              width={800}
              height={1000}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgb(94_224_255/0.14),transparent_65%)]">
              <div className="bg-grid absolute inset-0 opacity-70 [mask-image:none]" />
              <span className="absolute size-[72%] rotate-45 rounded-[28%] border border-accent/20" />
              <span className="absolute size-[52%] rotate-12 rounded-[28%] border border-accent-2/25" />
              <span className="relative font-display text-[clamp(4.5rem,12vw,7rem)] font-semibold tracking-[-0.08em] text-accent [text-shadow:0_0_40px_rgb(94_224_255/0.25)]">
                {profile.initials}
              </span>
            </div>
          )}
        </div>
        {/* Bottom fade + label for legibility over a photo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/85 to-transparent" />
        <span aria-hidden="true" className="absolute top-4 left-4 font-mono text-[0.68rem] tracking-[0.1em] text-muted uppercase">
          Profile / 01
        </span>
      </div>

      <figcaption className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
        <span>
          <span className="block font-display text-lg leading-tight font-semibold text-ink">{profile.name}</span>
          <span className="block text-sm text-muted">B.Tech CSE · PRMITR</span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-bg/70 sm:flex md:hidden lg:flex px-2.5 py-1 text-[0.7rem] text-ink backdrop-blur">
          <span className="size-1.5 rounded-full bg-lime" aria-hidden="true" /> Open to work
        </span>
      </figcaption>
    </figure>
  );
}
