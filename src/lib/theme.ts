import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "theme";
const THEME_COLOR: Record<Theme, string> = { dark: "#060814", light: "#ffffff" };

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
}

/**
 * Switch themes with a transition instead of a hard cut. Where the View Transitions API exists,
 * the new theme spreads out as a circle from `origin` (the toggle); elsewhere the colours
 * cross-fade. Reduced-motion users get an instant switch.
 */
export function transitionTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return applyTheme(next);

  if (!document.startViewTransition) {
    root.classList.add("theme-fading");
    applyTheme(next);
    window.setTimeout(() => root.classList.remove("theme-fading"), 650);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 900, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {
      /* transition skipped: the theme is still applied */
    });
}

/** Current theme plus a toggle. The initial value is set before paint by the inline script in index.html. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const toggle = useCallback((origin?: { x: number; y: number }) => transitionTheme(read() === "dark" ? "light" : "dark", origin), []);
  return { theme, toggle };
}
