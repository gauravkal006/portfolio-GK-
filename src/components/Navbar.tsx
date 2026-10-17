import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { navItems, profile } from "../data/profile";
import { useActiveSection } from "../hooks/useActiveSection";
import { useMagnetic } from "../hooks/useMagnetic";
import { PushButton } from "./PushButton";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navItems.map((item) => item.id);

export function Navbar() {
  const active = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const resumeRef = useRef<HTMLSpanElement>(null);
  useMagnetic(logoRef, 0.25);
  useMagnetic(resumeRef, 0.3);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock page scroll, move focus in, trap Tab, close on Escape or desktop resize.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return close();
      if (event.key !== "Tab") return;
      const items = [toggleRef.current!, ...focusables()];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onDesktop = () => desktop.matches && close(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/95" : "border-b border-transparent bg-bg/0"
      }`}
    >
      <nav className="container-page flex h-[4.5rem] items-center justify-between gap-6" aria-label="Main">
        <a ref={logoRef} href="#top" className="group flex items-center gap-3" aria-label={`${profile.name}, back to top`}>
          <span aria-hidden="true" className="nav-coin">
            gk
          </span>
          <span className="hidden text-[0.95rem] font-medium tracking-tight sm:inline">{profile.name}</span>
        </a>

        {/* Recessed tray of keys: a raised key slides to the hovered link and presses on click;
            the section you are reading gets a small indicator light. */}
        <ul className="nav-dock hidden xl:flex" onPointerLeave={() => setHovered(null)}>
          {navItems.map((item) => {
            const isActive = active === item.id;
            const showKey = (hovered ?? active) === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={item.label}
                  onPointerEnter={() => setHovered(item.id)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  className={`nav-link ${isActive ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {showKey && (
                    <motion.span
                      layoutId="nav-key"
                      aria-hidden="true"
                      className="nav-key"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="nav-index relative font-mono text-[0.72rem]">{item.index}</span>
                  {/* Label rolls up on hover to reveal an accent copy of itself. */}
                  <span className="nav-roll relative">
                    <span data-text={item.label}>{item.label}</span>
                  </span>
                  <span aria-hidden="true" className={`nav-led ${isActive ? "is-on" : ""}`} />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span ref={resumeRef} className="hidden sm:block">
            <PushButton href={profile.resume} download={profile.resumeFileName} variant="key" className="push--sm">
              Résumé <Download size={15} aria-hidden="true" className="arrow-d" />
            </PushButton>
          </span>
          <span className="xl:hidden">
          <button
            ref={toggleRef}
            type="button"
            className="push push--key push--sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="push__shadow" />
            <span aria-hidden="true" className="push__edge" />
            <span className="push__front">
              {open ? "Close" : "Menu"}
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
                <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </span>
          </button>
          </span>
        </div>
      </nav>

      <div id="mobile-menu" ref={panelRef} hidden={!open} className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-bg xl:hidden">
        <div className="container-page flex min-h-full flex-col py-6">
          <ul className="flex flex-col border-t border-ink">
            {navItems.map((item) => (
              <li key={item.id} className="border-b border-line">
                <a
                  href={`#${item.id}`}
                  onClick={() => close(false)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`flex items-baseline gap-4 py-4 font-serif text-[2rem] leading-tight transition-colors ${
                    active === item.id ? "text-accent-ink italic" : "text-ink hover:text-accent-ink"
                  }`}
                >
                  <span className="font-mono text-[0.82rem] text-muted not-italic">Nº {item.index}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8">
            <PushButton href={profile.resume} download={profile.resumeFileName} variant="primary" className="!block w-full [&>.push__front]:justify-center" onClick={() => close(false)}>
              Download résumé <Download size={17} aria-hidden="true" className="arrow-d" />
            </PushButton>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-arrow">
              GitHub <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow">
              LinkedIn <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
