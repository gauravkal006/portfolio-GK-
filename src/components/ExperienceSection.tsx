import { useRef } from "react";
import { activities, education, experience, type TimelineItem } from "../data/experience";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { openCertificate } from "../lib/certViewer";
import { Glyph, type GlyphShape } from "./Motif";
import { SectionHeading } from "./SectionHeading";

const groups: { title: string; glyph: GlyphShape; items: TimelineItem[]; hideOrg?: boolean }[] = [
  { title: "Experience", glyph: "circle", items: experience },
  { title: "Education", glyph: "arch", items: education },
  { title: "Activities", glyph: "triangle", items: activities },
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
            {(item.detail || item.certificate) && (
              <div className="sm:col-start-2 lg:col-start-3 lg:pt-1">
                {item.detail && <p className="text-[0.95rem] text-muted">{item.detail}</p>}
                {item.certificate && (
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(e) => openCertificate(item.certificate!, e.currentTarget)}
                    className="cert-thumb group mt-3"
                  >
                    <img src={item.certificate.image} alt="" loading="lazy" className="h-12 w-16 rounded-[6px] object-cover object-top" />
                    <span className="text-[0.92rem] font-medium transition-colors group-hover:text-accent-ink">View certificate</span>
                  </button>
                )}
              </div>
            )}
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
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="relative py-14 md:py-20">
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
        />

        <div className="space-y-9">
          {groups.map((g) => (
            <Group key={g.title} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
