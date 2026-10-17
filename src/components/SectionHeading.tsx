import type { ReactNode } from "react";

type Props = {
  index: string;
  kicker: string;
  title: ReactNode;
  note?: ReactNode;
  id?: string;
  /** Short text set on the right of the folio rule, like a running header. */
  aside?: string;
};

/** Numbered section opener: a ruled folio line, then a large serif title with an optional note. */
export function SectionHeading({ index, kicker, title, note, id, aside }: Props) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="relative flex items-baseline gap-4 pt-3">
        <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-ink" />
        <span className="font-mono text-[0.84rem] font-medium text-accent-ink">Nº {index}</span>
        <span className="label">{kicker}</span>
        {aside && <span className="label ml-auto hidden sm:block">{aside}</span>}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end" data-reveal>
        <h2 id={id} className="display text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.98] md:col-span-8">
          {title}
        </h2>
        {note && <p className="max-w-sm text-[0.98rem] text-muted md:col-span-4 md:justify-self-end">{note}</p>}
      </div>
    </header>
  );
}
