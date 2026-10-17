import { ArrowUpRight } from "lucide-react";
import { codingProfiles } from "../data/profile";

/** Competitive-programming profiles configured in profile.ts. Renders nothing until a URL is set. */
export function CodingProfiles() {
  const items = codingProfiles.filter((p) => p.url);
  if (!items.length) return null;

  return (
    <div className="mt-8 max-w-md">
      <p className="label !text-cover-ink/60">Coding profiles</p>
      <ul className="mt-2 flex flex-wrap gap-x-6" aria-label="Coding profiles">
        {items.map((p) => (
          <li key={p.name}>
            <a href={p.url!} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-accent-inv">
              {p.name}
              <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
