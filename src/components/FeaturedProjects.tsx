import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, slugOf, type Project, type ProjectCategory } from "../data/projects";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { ProjectCard, ProjectDetail } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

type Filter = "All" | ProjectCategory;
const filters: Filter[] = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Project | null>(null);
  const visible = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [filter]);

  useSectionReveal(ref);

  const open = useCallback((project: Project, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActive(project);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section ref={ref} id="projects" aria-labelledby="projects-title" className="relative py-14 md:py-20">
      <div className="container-page">
        <SectionHeading
          index="03"
          kicker="Selected work"
          aside={`${projects.length} projects`}
          id="projects-title"
          title={
            <>
              Things I've <em className="text-accent">built</em>
            </>
          }
        />

        <LayoutGroup>
          <div role="group" aria-label="Filter projects by category" className="nav-dock mb-7 inline-flex flex-wrap rounded-[1.6rem] sm:rounded-full">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`nav-link !px-5 !text-[1rem] ${filter === f ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    className="nav-key"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">{`Showing ${visible.length} project${visible.length === 1 ? "" : "s"}`}</p>
          <p className="mb-3 text-[0.92rem] text-muted md:hidden">Swipe to browse →</p>
          <motion.ul layout className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 swipe-row max-md:-mx-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-px-4 max-md:overflow-x-auto max-md:px-4 max-md:py-2">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <ProjectCard
                  key={slugOf(project)}
                  project={project}
                  number={projects.indexOf(project) + 1}
                  featured={Boolean(project.featured) && filter === "All"}
                  onOpen={open}
                />
              ))}
            </AnimatePresence>
            <motion.li layout key="more" className="max-md:w-[84%] max-md:shrink-0 max-md:snap-start">
              <a
                href={`${profile.github}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full min-h-56 flex-col justify-between gap-6 rounded-[20px] border border-dashed border-line-strong p-7 transition-colors hover:border-accent hover:bg-paper"
              >
                <span className="label">More on GitHub</span>
                <span className="display text-[1.9rem] leading-tight">
                  Browse all public <em className="text-accent">repositories</em>
                </span>
                <span className="flex items-center gap-2 font-medium transition-colors group-hover:text-accent-ink">
                  github.com/{profile.githubUser}
                  <ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </motion.li>
          </motion.ul>

          <ProjectDetail project={active} onClose={close} />
        </LayoutGroup>
      </div>
    </section>
  );
}
