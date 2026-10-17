import type { RefObject } from "react";
import { gsap, useGSAP, MOTION_OK } from "../lib/gsap";

/**
 * Scroll reveals for a section. Inside `scope`:
 *  - [data-reveal]  fades and rises into view on its own
 *  - [data-stagger] reveals its direct children one after another
 *  - [data-rule]    draws a horizontal rule from the left
 * Content is fully visible by default, so nothing is hidden if GSAP never runs,
 * and the reduced-motion media query skips the animations entirely.
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 18,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          gsap.from(group.children, {
            autoAlpha: 0,
            y: 14,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope },
  );
}
