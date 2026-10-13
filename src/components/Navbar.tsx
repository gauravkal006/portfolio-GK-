import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { navItems, profile } from "../data/profile";
import { useActiveSection } from "../hooks/useActiveSection";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

const sectionIds = navItems.map((item) => item.id);

export function Navbar() {
  const active = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
    const desktop = window.matchMedia("(min-width: 1024px)");
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-[4.25rem] items-center justify-between gap-6" aria-label="Main">
        <a href="#top" className="group flex items-center gap-3 rounded-lg" aria-label={`${profile.name}, back to top`}>
          <span className="grid size-9 place-items-center rounded-[10px] border border-accent/40 bg-accent/5 font-mono text-[0.78rem] font-medium text-accent transition-colors group-hover:bg-accent/10">
            {profile.initials}
          </span>
          <span className="hidden font-display text-[0.98rem] font-semibold tracking-tight sm:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative block rounded-full px-3.5 py-2 text-[0.9rem] transition-colors ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className="hidden size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink sm:grid"
          >
            <GitHubIcon />
          </a>
          <a href={profile.resume} download={profile.resumeFileName} className="btn btn-ghost hidden !min-h-10 !px-4 !text-[0.85rem] sm:inline-flex">
            <Download size={15} aria-hidden="true" className="arrow-d" />
            Resume
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-accent/50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
      >
        <div className="container-page flex min-h-full flex-col py-6">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.id} className="border-b border-line">
                <a
                  href={`#${item.id}`}
                  onClick={() => close(false)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`flex items-baseline gap-4 py-4 font-display text-2xl font-medium tracking-tight transition-colors ${
                    active === item.id ? "text-accent" : "text-ink hover:text-accent"
                  }`}
                >
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-primary" onClick={() => close(false)}>
              <Download size={16} aria-hidden="true" /> Download resume
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label="GitHub (opens in a new tab)">
              <GitHubIcon size={16} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label="LinkedIn (opens in a new tab)">
              <LinkedInIcon size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
