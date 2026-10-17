import { useSyncExternalStore } from "react";
import { useDragControls, type PanInfo } from "motion/react";

const PHONE = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** True on phone-sized screens (below the md breakpoint). */
export function useIsPhone() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(PHONE).matches, () => false);
}

/**
 * Phone behaviour for the site's popups: they rise from the bottom as app-style sheets with a
 * grab handle, and dragging the handle down far or fast enough closes them. On larger screens
 * the popups keep their centred desktop animation.
 */
export function useSheet(onClose: () => void) {
  const phone = useIsPhone();
  const controls = useDragControls();

  const phoneMotion = {
    initial: { y: "100%" },
    animate: { y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 34 } },
    exit: { y: "100%", transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
    drag: "y" as const,
    dragControls: controls,
    dragListener: false,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 0.7 },
    onDragEnd: (_: unknown, info: PanInfo) => {
      if (info.offset.y > 110 || info.velocity.y > 650) onClose();
    },
  };

  const handle = phone ? (
    <div
      onPointerDown={(e) => controls.start(e)}
      className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1 active:cursor-grabbing"
      aria-hidden="true"
    >
      <span className="h-1.5 w-11 rounded-full bg-line-strong" />
    </div>
  ) : null;

  /** Classes for the full-screen wrapper that positions the sheet. */
  const wrapClass = phone ? "place-items-end p-0" : "place-items-center p-3 sm:p-6";
  /** Extra classes for the sheet itself on phones. */
  const sheetClass = phone ? "!w-full !max-w-none !rounded-b-none !rounded-t-[24px] max-h-[92dvh] !border-b-0" : "";

  return { phone, phoneMotion, handle, wrapClass, sheetClass };
}
