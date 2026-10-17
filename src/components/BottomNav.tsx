import { motion } from "motion/react";
import { House, LayoutGrid, MessageCircle, Route, UserRound, type LucideIcon } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";

type Tab = { id: string; label: string; icon: LucideIcon; covers: string[] };

// Each tab also lights up for the sections that sit under it.
const tabs: Tab[] = [
  { id: "top", label: "Home", icon: House, covers: [""] },
  { id: "about", label: "About", icon: UserRound, covers: ["about", "skills"] },
  { id: "projects", label: "Work", icon: LayoutGrid, covers: ["projects", "github"] },
  { id: "experience", label: "Journey", icon: Route, covers: ["experience", "certificates", "resume"] },
  { id: "contact", label: "Contact", icon: MessageCircle, covers: ["contact"] },
];
const watched = ["about", "skills", "projects", "github", "experience", "certificates", "resume", "contact"];

/**
 * App-style tab bar for phones: a floating tray at the bottom of the screen within thumb reach.
 * A raised key slides to the tab for the section you are reading. Hidden from tablets up, where
 * the header navigation takes over.
 */
export function BottomNav() {
  const active = useActiveSection(watched);
  const current = tabs.find((t) => t.covers.includes(active))?.id ?? "top";

  return (
    <nav aria-label="Sections" className="bottom-nav md:hidden">
      <ul className="nav-dock flex w-full justify-between !rounded-[22px] !p-1.5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const on = current === id;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className={`relative flex min-h-[3.4rem] flex-col items-center justify-center gap-0.5 rounded-[16px] text-[0.78rem] font-medium transition-colors ${
                  on ? "text-accent-ink" : "text-muted"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="bottom-nav-key"
                    aria-hidden="true"
                    className="nav-key !rounded-[16px]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={21} strokeWidth={on ? 2.3 : 1.8} aria-hidden="true" className="relative" />
                <span className="relative">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
