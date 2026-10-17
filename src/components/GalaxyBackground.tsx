import { useEffect, useRef } from "react";
import { useTheme } from "../lib/theme";

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; depth: number; color: string };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; born: number };

const COLORS = ["255,255,255", "255,255,255", "255,255,255", "200,214,255", "255,226,196"];

/**
 * Galaxy theme backdrop: soft nebula glows (CSS) behind a canvas starfield that twinkles,
 * drifts slightly with scroll and throws the odd shooting star. It only animates while the
 * galaxy theme is on and the tab is visible; with reduced motion it draws one still frame.
 */
export function GalaxyBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 2500;
    let raf = 0;

    const seed = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.round((w * h) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.08 ? 1.2 + Math.random() * 0.9 : 0.35 + Math.random() * 0.8,
        a: 0.35 + Math.random() * 0.65,
        speed: 0.6 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        depth: 0.02 + Math.random() * 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      for (const s of stars) {
        const twinkle = still ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * s.speed + s.phase);
        const y = (((s.y - scroll * s.depth) % h) + h) % h;
        const alpha = s.a * twinkle;
        if (s.r > 1.2) {
          const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 4);
          g.addColorStop(0, `rgba(${s.color},${alpha})`);
          g.addColorStop(1, `rgba(${s.color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (still) return;
      if (!meteor && t > nextMeteor) {
        const angle = Math.PI * (0.15 + Math.random() * 0.12);
        const speed = 0.9 + Math.random() * 0.5;
        meteor = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.35, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 900, born: t };
      }
      if (meteor) {
        const age = t - meteor.born;
        if (age > meteor.life) {
          meteor = null;
          nextMeteor = t + 5000 + Math.random() * 6000;
        } else {
          const p = age / meteor.life;
          const hx = meteor.x + meteor.vx * age;
          const hy = meteor.y + meteor.vy * age;
          const tail = 140;
          const g = ctx.createLinearGradient(hx, hy, hx - meteor.vx * tail, hy - meteor.vy * tail);
          g.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - p)})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx - meteor.vx * tail, hy - meteor.vy * tail);
          ctx.stroke();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);

    const onResize = () => {
      seed();
      if (still) draw(0);
    };
    const onScroll = () => still && draw(0);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      ctx.clearRect(0, 0, w, h);
    };
  }, [active]);

  return (
    <div aria-hidden="true" className="galaxy pointer-events-none fixed inset-0 -z-10">
      <div className="galaxy__nebula" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
