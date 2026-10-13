import { useRef } from "react";
import { Award, Briefcase, GraduationCap, Trophy, type LucideIcon } from "lucide-react";
import { activities, certifications, education, experience, type TimelineItem } from "../data/experience";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { SectionHeading } from "./SectionHeading";

function Timeline({ title, icon: Icon, items }: { title: string; icon: LucideIcon; items: TimelineItem[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2.5 font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase" data-reveal>
        <Icon size={16} className="text-accent" aria-hidden="true" /> {title}
      </h3>
      <ol className="relative mt-6 ml-[5px] border-l border-line">
        <span data-line aria-hidden="true" className="absolute top-0 -left-px h-full w-px origin-top bg-gradient-to-b from-accent to-accent-2/40" />
        {items.map((item) => (
          <li key={item.title + item.period} className="relative pb-10 pl-7 last:pb-0" data-reveal>
            <span aria-hidden="true" className="absolute top-[0.45rem] -left-[5px] size-[9px] rounded-full border border-accent bg-bg" />
            <p className="font-mono text-[0.75rem] text-accent">{item.period}</p>
            <h4 className="mt-1.5 font-display text-[1.15rem] leading-snug font-semibold">{item.title}</h4>
            <p className="mt-0.5 text-[0.95rem] text-ink/80">
              {item.org}
              {item.place && <span className="text-subtle"> · {item.place}</span>}
            </p>
            {item.detail && <p className="mt-2 text-[0.93rem] text-muted">{item.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  // The accent line draws down each timeline as it scrolls through the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: line.parentElement, start: "top 75%", end: "bottom 60%", scrub: 0.6 } },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="05"
          kicker="Journey"
          id="experience-title"
          title="Experience & education"
          note="Where I've worked, what I've studied, and what I've picked up along the way."
        />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-16">
            <Timeline title="Experience" icon={Briefcase} items={experience} />
            <Timeline title="Activities" icon={Trophy} items={activities} />
          </div>
          <Timeline title="Education" icon={GraduationCap} items={education} />
        </div>

        <div className="mt-20">
          <h3 className="flex items-center gap-2.5 font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase" data-reveal>
            <Award size={16} className="text-accent" aria-hidden="true" /> Certifications
          </h3>
          <ul data-stagger className="mt-6 grid gap-3 sm:grid-cols-2">
            {certifications.map((cert) => (
              <li key={cert.name} className="panel flex items-center gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] font-mono text-[0.7rem] text-accent">
                  {cert.issuer.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-display font-semibold leading-snug">{cert.name}</p>
                  <p className="text-sm text-muted">{cert.issuer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
