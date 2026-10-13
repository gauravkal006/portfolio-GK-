import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CircleAlert, Download, Eye, FileText, X } from "lucide-react";
import { profile } from "../data/profile";
import { certifications } from "../data/experience";
import { featuredProjects } from "../data/projects";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { SectionHeading } from "./SectionHeading";

const contents = [
  { label: "Education", value: "B.Tech CSE (CGPA 8.1) · Diploma in IT (88.84%)" },
  { label: "Projects", value: featuredProjects.map((p) => p.name).join(" · ") },
  { label: "Skills", value: "Java, Spring Boot, REST APIs, SQL, Python, JavaScript" },
  { label: "Certifications", value: certifications.map((c) => c.issuer).join(" · ") },
];

export function ResumeSection() {
  const ref = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewRef = useRef<HTMLButtonElement>(null);
  const [available, setAvailable] = useState(true);
  const [previewed, setPreviewed] = useState(false);
  useSectionReveal(ref);

  // Confirm the PDF is actually served so we never show a dead download button.
  useEffect(() => {
    const controller = new AbortController();
    fetch(profile.resume, { method: "HEAD", signal: controller.signal })
      .then((res) => setAvailable(res.ok))
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, []);

  const openPreview = () => {
    // Mobile browsers often cannot render PDFs inline; hand them the file directly.
    const inlinePdf = (navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled;
    if (inlinePdf === false || window.matchMedia("(max-width: 767px)").matches) {
      window.open(profile.resume, "_blank", "noopener");
      return;
    }
    setPreviewed(true);
    dialogRef.current?.showModal();
  };

  return (
    <section ref={ref} id="resume" aria-labelledby="resume-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading index="06" kicker="Resume" id="resume-title" title="The one-page version" />

        <div data-reveal className="panel overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/5 text-accent">
                  <FileText size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-semibold">{profile.name}: Resume</p>
                  <p className="text-sm text-muted">PDF · 1 page</p>
                </div>
              </div>

              <dl className="mt-8 divide-y divide-line border-y border-line">
                {contents.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="font-mono text-[0.72rem] tracking-[0.06em] text-subtle uppercase sm:pt-0.5">{row.label}</dt>
                    <dd className="text-[0.95rem] text-ink/90">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {available ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={profile.resume} download={profile.resumeFileName} className="btn btn-primary">
                    <Download size={17} aria-hidden="true" className="arrow-d" /> Download resume
                  </a>
                  <button ref={viewRef} type="button" onClick={openPreview} className="btn btn-ghost">
                    <Eye size={17} aria-hidden="true" /> Preview
                  </button>
                </div>
              ) : (
                <div role="status" className="mt-8 flex gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm text-muted">
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <p>
                    The resume file isn't available right now. You can see the same details on{" "}
                    <a className="text-accent underline underline-offset-4" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>{" "}
                    or email me at{" "}
                    <a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a> for a copy.
                  </p>
                </div>
              )}
            </div>

            {/* Decorative paper preview */}
            <div aria-hidden="true" className="relative hidden min-h-[22rem] overflow-hidden border-l border-line bg-[radial-gradient(circle_at_50%_30%,rgb(94_224_255/0.08),transparent_60%)] lg:block">
              <div className="absolute top-12 left-1/2 w-[19rem] -translate-x-1/2 rotate-[-3deg] rounded-lg bg-[#f4f5f7] p-6 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] transition-transform duration-700 ease-[var(--ease-out-expo)] hover:rotate-0">
                <p className="text-center font-display text-[0.95rem] font-bold tracking-wide text-[#111]">GAURAV KALAMKHEDE</p>
                <div className="mx-auto mt-1.5 h-1 w-32 rounded bg-[#c9ccd2]" />
                {["Education", "Technical Skills", "Projects"].map((h, i) => (
                  <div key={h} className="mt-5">
                    <p className="border-b border-[#c9ccd2] pb-1 text-[0.62rem] font-semibold tracking-wider text-[#333] uppercase">{h}</p>
                    {Array.from({ length: i === 2 ? 4 : 3 }, (_, j) => (
                      <div key={j} className="mt-1.5 h-1 rounded bg-[#d9dce1]" style={{ width: `${92 - ((j * 17 + i * 9) % 35)}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="resume-dialog-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        onClose={() => viewRef.current?.focus()}
        className="m-auto h-[min(90dvh,900px)] w-[min(920px,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl border border-line-strong bg-bg p-0 text-ink shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm open:grid open:grid-rows-[auto_minmax(0,1fr)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 sm:px-5">
          <h2 id="resume-dialog-title" className="font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">Resume preview</h2>
          <div className="flex items-center gap-1">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:text-ink">
              Open in new tab <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href={profile.resume} download={profile.resumeFileName} className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink" aria-label="Download resume">
              <Download size={17} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => dialogRef.current?.close()} className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink" aria-label="Close preview">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {previewed && <iframe src={`${profile.resume}#view=FitH`} title="Gaurav Kalamkhede resume (PDF)" className="h-full w-full border-0 bg-[#fff]" />}
      </dialog>
    </section>
  );
}
