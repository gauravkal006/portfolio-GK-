import type { ReactNode } from "react";

type Props = {
  index: string;
  kicker: string;
  title: ReactNode;
  note?: ReactNode;
  id?: string;
};

export function SectionHeading({ index, kicker, title, note, id }: Props) {
  return (
    <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-end md:gap-10" data-reveal>
      <div>
        <p className="kicker">
          {index} / {kicker}
        </p>
        <h2 id={id} className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      {note && <p className="text-[0.975rem] text-muted md:text-right">{note}</p>}
    </div>
  );
}
