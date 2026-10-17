import type { MouseEvent } from "react";
import { useTheme } from "../lib/theme";

/**
 * Day / dark switch in a skeuomorphic style: a recessed, grainy track with a raised knob
 * that slides across (inspired by the classic skeuomorphism-vs-neumorphism toggle pen). An
 * engraved sun or moon on the knob says which theme is on. The page itself changes with a
 * circular reveal spreading from the switch.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to day theme" : "Switch to dark theme"}
      onClick={onClick}
      className={`skeu-switch ${className}`}
      data-on={dark || undefined}
    >
      <span aria-hidden="true" className="skeu-switch__track" />
      <span aria-hidden="true" className="skeu-switch__knob">
        <svg viewBox="0 0 24 24" className="skeu-switch__icon skeu-switch__icon--sun">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </svg>
        <svg viewBox="0 0 24 24" className="skeu-switch__icon skeu-switch__icon--moon">
          <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z" />
        </svg>
      </span>
    </button>
  );
}
