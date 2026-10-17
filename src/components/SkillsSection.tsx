import { useRef } from "react";
import { skillGroups, type SkillGroup } from "../data/skills";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { Glyph, type GlyphShape } from "./Motif";
import { SectionHeading } from "./SectionHeading";

const glyphs: Record<SkillGroup["id"], GlyphShape> = {
  languages: "square",
  backend: "circle",
  frontend: "half",
  data: "arch",
  ai: "triangle",
  tools: "quarter",
};

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section ref={ref} id="skills" aria-labelledby="skills-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="02"
          kicker="Skills"
          aside={`${skillGroups.length} groups`}
          id="skills-title"
          title={
            <>
              A working <em className="text-accent">toolkit</em>
            </>
          }
          note="Technologies I've used in coursework and in the projects below, grouped by where they sit in the stack."
        />

        <ol data-stagger className="border-t border-ink">
          {skillGroups.map((group, i) => (
            <li
              key={group.id}
              className="group grid gap-x-6 gap-y-3 border-b border-line py-6 transition-colors duration-300 hover:bg-paper md:grid-cols-12 md:items-baseline md:py-7"
            >
              <div className="flex items-baseline gap-4 md:col-span-4 lg:col-span-4">
                <span className="font-mono text-[0.84rem] text-muted transition-colors group-hover:text-accent-ink md:pl-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <h3 className="flex items-center gap-2.5 text-[1.6rem] leading-tight">
                    {group.title}
                    <Glyph shape={glyphs[group.id]} className="size-3 shrink-0 transition-transform duration-500 group-hover:rotate-90" />
                  </h3>
                  <p className="mt-1 text-[0.9rem] text-muted">{group.note}</p>
                </span>
              </div>
              <ul className="flex flex-wrap gap-x-1 gap-y-1.5 pl-9 text-[1.02rem] md:col-span-8 md:pl-0" aria-label={`${group.title} skills`}>
                {group.items.map((item, j) => (
                  <li key={item} className="whitespace-nowrap">
                    {item}
                    {j < group.items.length - 1 && (
                      <span aria-hidden="true" className="mx-2 text-line-strong">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
