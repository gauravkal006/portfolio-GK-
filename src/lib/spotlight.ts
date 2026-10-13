import type { PointerEvent } from "react";

/** Pointer handler that feeds the .spotlight gradient position via CSS variables (no re-render). */
export function spotlightMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}
