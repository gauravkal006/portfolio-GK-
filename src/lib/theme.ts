import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "theme";
const THEME_COLOR: Record<Theme, string> = { dark: "#0a0b0d", light: "#f6f7f9" };

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

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

/** Current theme plus a toggle. The initial value is set before paint by the inline script in index.html. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const toggle = useCallback(() => applyTheme(read() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}
