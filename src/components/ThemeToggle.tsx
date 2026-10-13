import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`group relative grid size-10 place-items-center overflow-hidden rounded-full border border-line-strong text-muted transition-colors hover:border-accent/50 hover:text-ink ${className}`}
    >
      <Sun
        size={17}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ease-[var(--ease-out-expo)] ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
      />
      <Moon
        size={17}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ease-[var(--ease-out-expo)] ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"}`}
      />
    </button>
  );
}
