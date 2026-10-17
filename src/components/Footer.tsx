import { navItems, profile } from "../data/profile";

/** Colophon, continuing the inverted back cover from the contact section. */
export function Footer() {
  return (
    <footer className="bg-cover text-cover-ink max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <div className="container-page grid gap-8 border-t border-cover-ink/30 py-10 md:grid-cols-12 md:items-start md:gap-6">
        <div className="md:col-span-5">
          <a href="#top" className="font-serif text-[1.5rem] italic transition-colors hover:text-accent-inv">
            {profile.name}
          </a>
          <p className="mt-2 text-[0.88rem] text-cover-ink/65">
            © {new Date().getFullYear()} · Designed and built in Amravati.
            <br />
            Set in Fraunces, DM Sans &amp; IBM Plex Mono.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-6 text-[0.92rem] text-cover-ink/80">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-accent-inv">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex flex-col text-[0.92rem] text-cover-ink/80 md:col-span-3 md:items-end" aria-label="Social links">
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center transition-colors hover:text-accent-inv">
              GitHub&nbsp;<span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center transition-colors hover:text-accent-inv">
              LinkedIn&nbsp;<span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} className="inline-flex min-h-9 items-center transition-colors hover:text-accent-inv">
              Email&nbsp;<span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
