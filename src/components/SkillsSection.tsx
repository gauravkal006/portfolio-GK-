import { useRef } from "react";
import { BrainCircuit, CodeXml, Database, LayoutTemplate, Server, Wrench, type LucideIcon } from "lucide-react";
import { skillGroups, type SkillGroup } from "../data/skills";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { spotlightMove } from "../lib/spotlight";
import { SectionHeading } from "./SectionHeading";

const icons: Record<SkillGroup["id"], LucideIcon> = {
  languages: CodeXml,
  backend: Server,
  frontend: LayoutTemplate,
  data: Database,
  ai: BrainCircuit,
  tools: Wrench,
};

const spans: Partial<Record<SkillGroup["id"], string>> = {
  backend: "lg:col-span-2",
  ai: "lg:col-span-2",
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
          id="skills-title"
          title="Tools of the trade"
          note="Technologies I've used in coursework and in the projects below, grouped by where they sit in the stack."
        />

        <ul data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => {
            const Icon = icons[group.id];
            return (
              <li
                key={group.id}
                onPointerMove={spotlightMove}
                className={`panel spotlight group flex flex-col p-6 transition-colors hover:border-line-strong ${spans[group.id] ?? ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent transition-colors group-hover:border-accent/40">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[0.7rem] text-subtle">{String(group.items.length).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{group.title}</h3>
                <p className="mt-1 text-sm text-muted">{group.note}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${group.title} skills`}>
                  {group.items.map((item) => (
                    <li key={item} className="chip hover:border-accent/40 hover:text-ink">{item}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
