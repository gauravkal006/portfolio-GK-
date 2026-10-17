/*
  Holographic profile card.
  Adapted from "Holographic, Interactive Card" by @simeydotme (https://codepen.io/simeydotme),
  itself based on his Pokémon card work. CodePen public pens are MIT licensed.
  Changes: React component with your photo and details; restyled to suit this site (solid
  card face, thin iridescent rim and a soft pastel sheen instead of the full foil, no remote
  image assets); reduced-motion support; touch-action that still lets phones scroll past it.
*/
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { onIntroDone } from "../lib/intro";

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number) => Math.round(v * 1000) / 1000;
const remap = (v: number, a: number, b: number, c: number, d: number) => round(c + ((d - c) * (v - a)) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function HoloCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    /** Write the pointer position (0–100 on each axis) into the CSS variables that drive the effect. */
    const set = (px: number, py: number) => {
      const cx = px - 50;
      const cy = py - 50;
      const s = wrap.style;
      s.setProperty("--pointer-x", `${px}%`);
      s.setProperty("--pointer-y", `${py}%`);
      s.setProperty("--background-x", `${remap(px, 0, 100, 35, 65)}%`);
      s.setProperty("--background-y", `${remap(py, 0, 100, 35, 65)}%`);
      s.setProperty("--pointer-from-center", `${clamp(Math.sqrt(cy * cy + cx * cx) / 50, 0, 1)}`);
      s.setProperty("--pointer-from-top", `${py / 100}`);
      s.setProperty("--pointer-from-left", `${px / 100}`);
      s.setProperty("--rotate-x", `${round(-(cx / 5))}deg`);
      s.setProperty("--rotate-y", `${round(cy / 4)}deg`);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(50, 50);
      return;
    }

    let last = { x: 50, y: 50 };
    let raf = 0;
    const stop = () => cancelAnimationFrame(raf);

    /** Ease the light back from one point to another, then optionally settle the card. */
    const glide = (from: { x: number; y: number }, to: { x: number; y: number }, ms: number, done?: () => void) => {
      stop();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / ms, 1);
        const e = ease(p);
        last = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
        set(last.x, last.y);
        if (p < 1) raf = requestAnimationFrame(step);
        else done?.();
      };
      raf = requestAnimationFrame(step);
    };

    const settle = () => wrap.classList.remove("is-active");

    const onEnter = () => {
      stop();
      wrap.classList.add("is-active");
    };
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      last = { x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) };
      wrap.classList.add("is-active");
      set(last.x, last.y);
    };
    const onLeave = () => glide(last, { x: 50, y: 50 }, 1000, settle);

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    // Intro: catch the light in the top-right corner, then let it drift back to centre.
    wrap.classList.add("is-active");
    last = { x: 88, y: 10 };
    set(last.x, last.y);
    let timer = 0;
    const offIntro = onIntroDone(() => {
      timer = window.setTimeout(() => glide(last, { x: 50, y: 50 }, 3000, settle), 700);
    });

    return () => {
      offIntro();
      window.clearTimeout(timer);
      stop();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="holo">
      <div ref={cardRef} className="holo__card">
        <div className="holo__inside">
          <div aria-hidden="true" className="holo__sheen" />
          <div aria-hidden="true" className="holo__glare" />
          <div className="holo__content holo__photo">
            {profile.photo && !failed ? (
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={900} height={1200} onError={() => setFailed(true)} />
            ) : (
              <span aria-hidden="true" className="holo__monogram">{profile.initials}</span>
            )}
          </div>
          <div className="holo__content holo__details">
            <p className="holo__name">{profile.name}</p>
            <p className="holo__meta">B.Tech CSE · {profile.location.split(",")[0]}</p>
            <p className="holo__role">Full-stack · AI/ML</p>
          </div>
        </div>
      </div>
    </div>
  );
}
