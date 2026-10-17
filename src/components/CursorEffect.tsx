import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='switch'], label, summary, select";
const TEXT = "input:not([type='checkbox']):not([type='radio']), textarea";

/**
 * Site-wide cursor: a dot that tracks the pointer exactly and a ring that trails it smoothly.
 * The ring grows over links and buttons, squeezes on press, shows a short label over elements
 * with `data-cursor="…"`, and narrows to a caret over text fields. Both use difference blending,
 * so they invert against light and dark backgrounds. In the dark theme a soft warm glow follows
 * the cursor behind the content. Mouse/trackpad only; skipped for reduced motion.
 */
export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const glow = glowRef.current!;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const glowPos = { x: -100, y: -100 };
    let raf = 0;
    let running = false;

    const frame = () => {
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;
      glowPos.x += (target.x - glowPos.x) * 0.08;
      glowPos.y += (target.y - glowPos.y) * 0.08;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      glow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0)`;
      const settled = Math.abs(target.x - glowPos.x) < 0.3 && Math.abs(target.y - glowPos.y) < 0.3;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      root.classList.add("cursor-visible");
      wake();
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      const text = el?.closest(TEXT);
      const interactive = el?.closest(INTERACTIVE);
      ring.dataset.state = labelled ? "label" : text ? "text" : interactive ? "hover" : "";
      label.textContent = labelled?.dataset.cursor ?? "";
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => root.classList.remove("cursor-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor", "cursor-visible");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} aria-hidden="true" className="cursor-glow" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring">
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
