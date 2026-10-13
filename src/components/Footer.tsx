import { Mail } from "lucide-react";
import { navItems, profile } from "../data/profile";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { CodingProfiles } from "./CodingProfiles";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">{profile.name}</a>
          <p className="mt-1 text-sm text-subtle">© {new Date().getFullYear()} · Designed and built in Amravati.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="link-underline transition-colors hover:text-ink">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-1">
          <ul className="flex gap-1" aria-label="Social links">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"><GitHubIcon /></a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"><LinkedInIcon /></a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"><Mail size={18} aria-hidden="true" /></a>
            </li>
          </ul>
          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-line-strong sm:block" />
          <CodingProfiles compact />
        </div>
      </div>
    </footer>
  );
}
