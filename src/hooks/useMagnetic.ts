import { useEffect, type RefObject } from "react";

/**
 * Pulls an element a few pixels toward the cursor while the cursor is near it, and springs it
 * back on leave. Mouse/trackpad only; skipped for reduced motion. `strength` is the share of the
 * cursor's offset from the centre that the element follows.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [ref, strength]);
}
