import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { featuredProjects, otherProjects, type ProjectCategory } from "../data/projects";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { spotlightMove } from "../lib/spotlight";
import { ProjectArt } from "./ProjectArt";
import { ProjectCard, ProjectLinks } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

type Filter = "All" | ProjectCategory;
const filters: Filter[] = ["All", ...Array.from(new Set(otherProjects.map((p) => p.category)))];

export function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => (filter === "All" ? otherProjects : otherProjects.filter((p) => p.category === filter)), [filter]);

  useSectionReveal(ref);

  // Masked cover reveal for featured projects.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-cover]").forEach((cover) => {
          const scrollTrigger = { trigger: cover, start: "top 85%", once: true };
          gsap.fromTo(
            cover,
            { clipPath: "inset(10% 10% 10% 10% round 16px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.out", duration: 1.2, scrollTrigger },
          );
          gsap.from(cover.firstElementChild, { scale: 1.15, duration: 1.4, ease: "power2.out", scrollTrigger });
        });
      });
    },
    { scope: ref },
  );

  // Re-stagger the grid when the filter changes (not on first render; the scroll reveal handles that).
  const firstRun = useRef(true);
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gridRef.current!.children,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", overwrite: true },
        );
      });
    },
    { dependencies: [filter], scope: gridRef },
  );

  return (
    <section ref={ref} id="projects" aria-labelledby="projects-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="03"
          kicker="Selected work"
          id="projects-title"
          title="Projects I've built"
          note="Real projects from my resume and public GitHub repositories, with source code and live demos where available."
        />

        <ol className="space-y-6 md:space-y-8">
          {featuredProjects.map((project, i) => (
            <li key={project.name} data-reveal>
              <article
                onPointerMove={spotlightMove}
                className="panel spotlight group grid overflow-hidden transition-colors hover:border-line-strong lg:grid-cols-2"
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden border-line max-lg:border-b lg:aspect-auto lg:min-h-[24rem] ${
                    i % 2 ? "lg:order-2 lg:border-l" : "lg:border-r"
                  }`}
                >
                  <div data-cover className="absolute inset-0">
                    <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
                      <ProjectArt motif={project.motif} category={project.category} name={project.name} />
                    </div>
                  </div>
                  <span className="absolute top-4 left-4 font-mono text-[0.72rem] text-muted">
                    {String(i + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] tracking-[0.06em] uppercase">
                    <span className="text-accent">{project.label}</span>
                    {project.year && (
                      <span className="flex items-center gap-3 text-subtle">
                        <span aria-hidden="true" className="size-1 rounded-full bg-subtle" />
                        {project.year}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-semibold tracking-[-0.03em]">{project.name}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{project.description}</p>
                  {project.highlights && (
                    <ul className="mt-5 space-y-2.5">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink/80">
                          <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <ul className="mt-6 mb-8 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.stack.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <ProjectLinks project={project} size="md" />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-20 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">More from GitHub</h3>
            <p className="mt-1 text-muted">Experiments, learning projects and earlier builds.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-10 rounded-full border px-4 text-[0.85rem] transition-colors ${
                  filter === f ? "border-accent/60 bg-accent/10 text-ink" : "border-line-strong text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{`Showing ${visible.length} project${visible.length === 1 ? "" : "s"}`}</p>
        <ul ref={gridRef} data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.repo}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center" data-reveal>
          <a
            href={`${profile.github}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1.5 text-[0.95rem] text-accent"
          >
            Browse all public repositories <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
