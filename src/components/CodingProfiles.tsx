import { ArrowUpRight } from "lucide-react";
import { codingProfiles } from "../data/profile";

/** Links to competitive-programming profiles configured in profile.ts. */
export function CodingProfiles({ compact = false }: { compact?: boolean }) {
  const items = codingProfiles.filter((p) => p.url);
  if (!items.length) return null;

  if (compact) {
    return (
      <ul className="flex flex-wrap gap-1" aria-label="Coding profiles">
        {items.map((p) => (
          <li key={p.name}>
            <a
              href={p.url!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} (opens in a new tab)`}
              title={p.name}
              className="grid size-11 place-items-center rounded-full font-mono text-[0.72rem] font-medium text-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              {p.short}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Coding profiles">
      {items.map((p) => (
        <li key={p.name}>
          <a
            href={p.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-accent/40 hover:bg-accent/[0.04]"
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-lg font-mono text-[0.7rem] font-semibold"
              style={{ color: p.color, background: `${p.color}1a`, boxShadow: `inset 0 0 0 1px ${p.color}40` }}
            >
              {p.short}
            </span>
            <span className="min-w-0 truncate text-[0.9rem] text-ink">{p.name}</span>
            <ArrowUpRight size={14} aria-hidden="true" className="ml-auto shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
