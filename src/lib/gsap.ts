import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger, useGSAP };

/** Preloader timing (seconds). The hero intro starts as the loader curtain lifts. */
export const PRELOAD_HOLD = 0.5;
export const PRELOAD_EXIT = 0.45;
export const INTRO_DELAY = PRELOAD_HOLD + PRELOAD_EXIT * 0.6;
