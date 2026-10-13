import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";
import { spotlightMove } from "../lib/spotlight";
import { GitHubIcon } from "./BrandIcons";
import { ProjectArt } from "./ProjectArt";

export function ProjectLinks({ project, size = "sm" }: { project: Project; size?: "sm" | "md" }) {
  const cls = size === "md" ? "btn !min-h-11 !text-[0.875rem]" : "btn !min-h-10 !px-3.5 !text-[0.82rem]";
  return (
    <div className="flex flex-wrap gap-2">
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`${cls} btn-primary`} aria-label={`${project.name} live demo (opens in a new tab)`}>
          Live demo <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
        </a>
      )}
      <a href={project.repo} target="_blank" rel="noopener noreferrer" className={`${cls} btn-ghost`} aria-label={`${project.name} source code on GitHub (opens in a new tab)`}>
        <GitHubIcon size={15} /> Source <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
      </a>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      onPointerMove={spotlightMove}
      className="panel spotlight group flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
        <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
          <ProjectArt motif={project.motif} category={project.category} name={project.name} />
        </div>
        <span className="absolute top-3 left-3 rounded-full border border-line-strong bg-bg/70 px-2.5 py-1 font-mono text-[0.68rem] text-muted backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-[0.7rem] tracking-[0.08em] text-subtle uppercase">{project.label}</p>
        <h3 className="mt-1.5 text-[1.2rem] font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-4 mb-6 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.stack.map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        <div className="mt-auto">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
