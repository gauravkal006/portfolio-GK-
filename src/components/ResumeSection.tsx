import { useEffect, useRef, useState } from "react";
import { Download, Eye } from "lucide-react";
import { profile } from "../data/profile";
import { certifications } from "../data/experience";
import { featuredProjects } from "../data/projects";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { viewResumeClick } from "../lib/resumeViewer";
import { PushButton } from "./PushButton";
import { SectionHeading } from "./SectionHeading";

const contents = [
  { label: "Education", value: "B.Tech CSE (CGPA 8.1) · Diploma in IT (88.84%)" },
  { label: "Projects", value: featuredProjects.map((p) => p.name).join(" · ") },
  { label: "Skills", value: "Java, Spring Boot, REST APIs, SQL, Python, JavaScript" },
  { label: "Certifications", value: certifications.map((c) => c.issuer).join(" · ") },
];

export function ResumeSection() {
  const ref = useRef<HTMLElement>(null);
  const [available, setAvailable] = useState(true);
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


  return (
    <section ref={ref} id="resume" aria-labelledby="resume-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="06"
          kicker="Résumé"
          aside="PDF · 1 page"
          id="resume-title"
          title={
            <>
              The <em className="text-accent">one-page</em> version
            </>
          }
        />

        <div className="grid gap-14 md:grid-cols-12 md:items-center md:gap-6">
          <div data-reveal className="md:col-span-7">
            <dl className="border-t border-ink">
              {contents.map((row) => (
                <div key={row.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="label sm:pt-1">{row.label}</dt>
                  <dd className="font-serif text-[1.15rem] leading-snug">{row.value}</dd>
                </div>
              ))}
            </dl>

            {available ? (
              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-5">
                <PushButton href={profile.resume} download={profile.resumeFileName} variant="primary">
                  Download résumé <Download size={17} aria-hidden="true" className="arrow-d" />
                </PushButton>
                <PushButton href={profile.resume} onClick={viewResumeClick} variant="key">
                  <Eye size={17} aria-hidden="true" /> View résumé
                </PushButton>
              </div>
            ) : (
              <p role="status" className="mt-8 max-w-lg border-l-2 border-accent pl-4 text-[0.95rem] text-muted">
                The résumé file isn't available right now. You can see the same details on{" "}
                <a className="text-accent-ink underline underline-offset-4" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>{" "}
                or email me at{" "}
                <a className="text-accent-ink underline underline-offset-4" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>{" "}
                for a copy.
              </p>
            )}
          </div>

          {/* Decorative sheet of paper, taped to the page. */}
          <div aria-hidden="true" className="relative hidden md:col-span-4 md:col-start-9 md:block">
            <div className="relative mx-auto w-full max-w-[19rem] rotate-[2.5deg] border border-line bg-paper p-6 shadow-[6px_8px_0_0_var(--color-paper-2)] transition-transform duration-700 ease-[var(--ease-out-expo)] hover:rotate-0">
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-mustard/60" />
              <p className="text-center font-serif text-[1.05rem] tracking-wide">GAURAV KALAMKHEDE</p>
              <div className="mx-auto mt-2 h-px w-32 bg-line-strong" />
              {["Education", "Technical skills", "Projects"].map((h, i) => (
                <div key={h} className="mt-5">
                  <p className="border-b border-line pb-1 font-mono text-[0.8rem] tracking-wider text-muted uppercase">{h}</p>
                  {Array.from({ length: i === 2 ? 4 : 3 }, (_, j) => (
                    <div key={j} className="mt-1.5 h-[3px] bg-paper-2" style={{ width: `${92 - ((j * 17 + i * 9) % 35)}%` }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
