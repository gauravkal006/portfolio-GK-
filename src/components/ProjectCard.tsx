import { useEffect, useRef, useState, type PointerEvent, type Ref } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { ArrowUpRight, Lock, Plus, X } from "lucide-react";
import { slugOf, type Project } from "../data/projects";
import { useSheet } from "../lib/sheet";
import { ProjectArt } from "./ProjectArt";

const spring = { type: "spring", stiffness: 260, damping: 30 } as const;

/** Live demo and source links. Only real URLs from the project data are rendered. */
export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-1">
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link-arrow">
          Visit live site <ArrowUpRight size={17} aria-hidden="true" className="arrow-ur" />
          <span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
      )}
      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link-arrow">
        Read the source <ArrowUpRight size={17} aria-hidden="true" className="arrow-ur" />
        <span className="sr-only">: {project.name} on GitHub (opens in a new tab)</span>
      </a>
    </div>
  );
}

/**
 * Browser-window frame for a project preview. Shows `project.preview` (a screenshot in
 * public/images/projects/) when set; otherwise the illustrated template, plus a dev-only hint
 * naming the file to add. In the card the shot fills a 16:10 window from the top-left; with
 * `full` (the opened sheet) it is shown whole at its own proportions.
 */
export function PreviewFrame({ project, full = false }: { project: Project; full?: boolean }) {
  // Cards use a slightly wider 16:9 window to keep them compact; the opened sheet uses 16:10.
  const [failed, setFailed] = useState(false);
  const slug = slugOf(project);
  const url = project.demo ? project.demo.replace(/^https?:\/\//, "").replace(/\/$/, "") : `github.com/gauravkal006/${slug}`;
  const showShot = Boolean(project.preview) && !failed;

  return (
    <div className="overflow-hidden bg-paper-2">
      <div className="flex items-center gap-3 border-b border-line bg-paper px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="size-2.5 rounded-full bg-mustard" />
          <span className="size-2.5 rounded-full bg-olive" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-bg px-2.5 py-1 font-mono text-[0.8rem] text-muted">
          <Lock size={11} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{url}</span>
        </span>
      </div>
      <div className={`relative overflow-hidden ${full && showShot ? "" : full ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
          {showShot ? (
            <img
              src={project.preview}
              alt={`Screenshot of ${project.name}`}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className={full ? "block h-auto w-full" : "h-full w-full object-cover object-left-top"}
            />
          ) : (
            <ProjectArt motif={project.motif} category={project.category} name={project.name} />
          )}
        </div>
        {!showShot && import.meta.env.DEV && (
          <span className="absolute inset-x-3 bottom-3 rounded-md border border-dashed border-line-strong bg-bg/90 px-3 py-2 font-mono text-[0.84rem] text-muted">
            Add a screenshot: public/images/projects/{slug}.webp
          </span>
        )}
      </div>
    </div>
  );
}

type CardProps = {
  project: Project;
  number: number;
  featured: boolean;
  onOpen: (project: Project, opener: HTMLButtonElement) => void;
  ref?: Ref<HTMLLIElement>;
};

/** Collapsed project card: tilts gently toward the pointer, lifts on hover, expands on click. */
export function ProjectCard({ project, number, featured, onOpen, ref }: CardProps) {
  const slug = slugOf(project);
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const r = event.currentTarget.getBoundingClientRect();
    rotateX.set(-((event.clientY - r.top) / r.height - 0.5) * 5);
    rotateY.set(((event.clientX - r.left) / r.width - 0.5) * 7);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.li
      ref={ref}
      layout
      className="h-full max-md:w-[84%] max-md:shrink-0 max-md:snap-start"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={spring}
    >
      <motion.article
        layoutId={`card-${slug}`}
        onPointerMove={onMove}
        onPointerLeave={reset}
        whileHover={{ y: -6 }}
        style={{ borderRadius: 20, rotateX, rotateY, transformPerspective: 1000 }}
        transition={spring}
        className="project-card group relative flex h-full flex-col overflow-hidden border border-line bg-bg"
      >
        <motion.div layoutId={`preview-${slug}`} transition={spring}>
          <PreviewFrame project={project} />
        </motion.div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-serif text-[1.1rem] italic text-accent-ink">No. {String(number).padStart(2, "0")}</span>
            <span className="flex items-center gap-2">
              {featured && <span className="label rounded-full border border-line px-2.5 py-0.5 !text-ink">Featured</span>}
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full border border-line-strong text-ink transition-[transform,color,border-color] duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90 group-hover:border-accent group-hover:text-accent-ink"
              >
                <Plus size={16} />
              </span>
            </span>
          </div>
          <motion.h3 layoutId={`title-${slug}`} transition={spring} className="display mt-2 text-[clamp(1.45rem,2vw,1.75rem)] leading-[1.08]">
            {project.name}
          </motion.h3>
          <p className="label mt-1">
            {project.label}
            {project.year && <> · {project.year}</>}
          </p>
          <p className="mt-2.5 line-clamp-2 text-[0.98rem] leading-relaxed text-muted">{project.description}</p>
          <ul className="stack-list mt-3" aria-label="Technologies">
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        {/* The whole card is one button; its accessible name is the project. */}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={`Open ${project.name} details`}
          onClick={(e) => {
            reset();
            onOpen(project, e.currentTarget);
          }}
          className="absolute inset-0 z-10 cursor-pointer rounded-[20px]"
        />
      </motion.article>
    </motion.li>
  );
}

/** Expanded project view. Shares layout ids with its card, so the card grows into this sheet. */
export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { phone, phoneMotion, handle, wrapClass, sheetClass } = useSheet(onClose);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-[rgb(8_10_20/0.5)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div key="sheet" className={`pointer-events-none fixed inset-0 z-[90] grid ${wrapClass}`}>
            <motion.div
              ref={sheetRef}
              layoutId={phone ? undefined : `card-${slugOf(project)}`}
              transition={spring}
              {...(phone ? phoneMotion : {})}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-detail-title"
              style={{ borderRadius: 24 }}
              className={`pointer-events-auto relative max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain border border-line bg-bg shadow-[0_40px_120px_-30px_rgb(0_0_0/0.55)] sm:max-h-[calc(100dvh-3rem)] ${sheetClass}`}
            >
              {handle && <div className="sticky top-0 z-20 bg-bg">{handle}</div>}
              <motion.div layoutId={phone ? undefined : `preview-${slugOf(project)}`} transition={spring}>
                <PreviewFrame project={project} full />
              </motion.div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="absolute top-14 right-3 z-10 grid size-11 place-items-center rounded-full border border-line bg-bg/90 text-ink shadow-md transition-transform hover:rotate-90"
              >
                <X size={19} aria-hidden="true" />
              </button>

              <div className="p-6 sm:p-9">
                <motion.h3 layoutId={phone ? undefined : `title-${slugOf(project)}`} transition={spring} id="project-detail-title" className="display text-[clamp(2.2rem,5vw,3.25rem)] leading-[1]">
                  {project.name}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.4 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <p className="label mt-3">
                    {project.label} · {project.category}
                    {project.year && <> · {project.year}</>}
                  </p>
                  <p className="mt-6 text-[1.15rem] leading-relaxed">{project.description}</p>
                  {project.highlights && (
                    <div className="mt-8">
                      <p className="label !text-ink">What I built</p>
                      <ul className="mt-3 space-y-3 border-t border-line pt-4">
                        {project.highlights.map((h) => (
                          <li key={h} className="grid grid-cols-[1.4rem_minmax(0,1fr)] text-[1.05rem] leading-relaxed text-muted">
                            <span aria-hidden="true" className="text-accent">–</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul className="stack-list mt-8" aria-label="Technologies">
                    {project.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-line pt-5">
                    <ProjectLinks project={project} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
