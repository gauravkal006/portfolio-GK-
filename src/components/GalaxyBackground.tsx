import { useEffect, useRef } from "react";
import { useTheme } from "../lib/theme";

type Mote = { x: number; y: number; r: number; a: number; speed: number; phase: number; rise: number; color: string };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; born: number };

const COLORS = ["255,244,230", "255,244,230", "255,228,200", "255,214,170", "232,226,214"];

/**
 * Dark-theme backdrop that moves like an ambient video loop: large warm light blobs drifting
 * slowly behind everything (CSS, transform only), with a canvas of soft motes that twinkle and
 * rise like dust in a beam of light, plus a rare shooting star. Animates only while the dark
 * theme is on and the tab is visible; reduced motion gets one still frame.
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
    let motes: Mote[] = [];
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 6000;
    let raf = 0;
    let last = performance.now();

    const seed = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.round((w * h) / 9000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.06 ? 1.1 + Math.random() * 0.7 : 0.3 + Math.random() * 0.7,
        a: 0.18 + Math.random() * 0.45,
        speed: 0.5 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        rise: 0.004 + Math.random() * 0.014,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!still) {
          m.y -= m.rise * dt;
          m.x += Math.sin(t * 0.0003 + m.phase) * 0.02 * dt * m.rise * 20;
          if (m.y < -4) {
            m.y = h + 4;
            m.x = Math.random() * w;
          }
        }
        const alpha = m.a * (still ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * m.speed + m.phase));
        if (m.r > 1.1) {
          const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
          g.addColorStop(0, `rgba(${m.color},${alpha})`);
          g.addColorStop(1, `rgba(${m.color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${m.color},${alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (still) return;
      if (!meteor && t > nextMeteor) {
        const angle = Math.PI * (0.15 + Math.random() * 0.12);
        const speed = 0.8 + Math.random() * 0.4;
        meteor = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.3, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 900, born: t };
      }
      if (meteor) {
        const age = t - meteor.born;
        if (age > meteor.life) {
          meteor = null;
          nextMeteor = t + 12000 + Math.random() * 8000;
        } else {
          const p = age / meteor.life;
          const hx = meteor.x + meteor.vx * age;
          const hy = meteor.y + meteor.vy * age;
          const tail = 120;
          const g = ctx.createLinearGradient(hx, hy, hx - meteor.vx * tail, hy - meteor.vy * tail);
          g.addColorStop(0, `rgba(255,240,220,${0.7 * (1 - p)})`);
          g.addColorStop(1, "rgba(255,240,220,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
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
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ctx.clearRect(0, 0, w, h);
    };
  }, [active]);

  return (
    <div aria-hidden="true" className="galaxy pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient__blob ambient__blob--a" />
      <div className="ambient__blob ambient__blob--b" />
      <div className="ambient__blob ambient__blob--c" />
      <div className="ambient__blob ambient__blob--d" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="ambient__grain" />
    </div>
  );
}
