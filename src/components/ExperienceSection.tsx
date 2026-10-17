import { useRef } from "react";
import { activities, certifications, education, experience, type TimelineItem } from "../data/experience";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { Glyph, type GlyphShape } from "./Motif";
import { SectionHeading } from "./SectionHeading";

const certificationRows: TimelineItem[] = certifications.map((c) => ({ period: c.issuer, title: c.name, org: c.issuer }));

const groups: { title: string; glyph: GlyphShape; items: TimelineItem[]; hideOrg?: boolean }[] = [
  { title: "Experience", glyph: "circle", items: experience },
  { title: "Education", glyph: "arch", items: education },
  { title: "Activities", glyph: "triangle", items: activities },
  { title: "Certifications", glyph: "half", items: certificationRows, hideOrg: true },
];

/** One ruled block of the journey: group name in the margin, entries as date / role / detail rows. */
function Group({ title, glyph, items, hideOrg }: (typeof groups)[number]) {
  return (
    <div className="grid gap-4 border-t border-ink pt-4 md:grid-cols-12 md:gap-6">
      <h3 className="flex items-center gap-2.5 self-start font-serif text-[1.35rem] italic md:col-span-3" data-reveal>
        <Glyph shape={glyph} className="size-3 shrink-0" />
        {title}
      </h3>
      <ol data-stagger className="divide-y divide-line md:col-span-9">
        {items.map((item) => (
          <li
            key={item.title + item.period}
            className="group grid gap-x-6 gap-y-1 py-4 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <p className="label pt-1.5 transition-colors group-hover:text-accent-ink">{item.period}</p>
            <div>
              <h4 className="text-[1.3rem] leading-snug">{item.title}</h4>
              {!hideOrg && (
                <p className="mt-0.5 text-[0.95rem] text-muted">
                  {item.org}
                  {item.place && <> · {item.place}</>}
                </p>
              )}
            </div>
            {item.detail && <p className="text-[0.95rem] text-muted sm:col-start-2 lg:col-start-3 lg:pt-1">{item.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="05"
          kicker="Journey"
          aside="2015 — present"
          id="experience-title"
          title={
            <>
              Experience &amp; <em className="text-accent">education</em>
            </>
          }
          note="Where I've worked, what I've studied, and what I've picked up along the way."
        />

        <div className="space-y-14">
          {groups.map((g) => (
            <Group key={g.title} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
