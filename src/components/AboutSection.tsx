import { useRef } from "react";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { SectionHeading } from "./SectionHeading";

const facts = [
  { label: "Studying", value: "B.Tech, Computer Science Engineering", sub: "PRMITR, Amravati · CGPA 8.1" },
  { label: "Before that", value: "Diploma in Information Technology", sub: "Government Polytechnic, Amravati · 88.84%" },
  { label: "Recently built", value: "Validify & DocBlendAI", sub: "Azure-backed verification and document QA" },
  { label: "Based in", value: "Amravati, Maharashtra", sub: "India" },
];

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="01"
          kicker="About"
          aside="A short introduction"
          id="about-title"
          title={
            <>
              Curious by nature. <br className="hidden sm:block" />
              <em className="text-accent">Builder</em> by choice.
            </>
          }
        />

        <div className="grid gap-14 md:grid-cols-12 md:gap-6">
          <div data-reveal className="space-y-6 text-[1.1rem] leading-[1.75] md:col-span-7 md:col-start-6 md:row-start-1 lg:col-span-6 lg:col-start-6">
            <p className="dropcap">
              My name is Gaurav, and I'm a Computer Science Engineering student at Prof. Ram Meghe Institute of Technology and Research in
              Amravati. I came to the degree after a Diploma in Information Technology, and the things that keep pulling me in
              are software development, AI/ML and a good problem to solve.
            </p>
            <p className="text-muted">
              Most of what I build sits where web development, databases and AI meet: a Google Drive-style storage app, a
              certificate verification platform on Azure, and a question-answering assistant that can read handwritten notes.
              Lately that has meant <span className="text-ink">document intelligence</span>,{" "}
              <span className="text-ink">secure cloud backends</span> and <span className="text-ink">full-stack Java</span>.
            </p>
            <p className="text-muted">
              Along the way I interned as a Java full-stack developer at Compilers Technologies and built prototypes at 24-hour
              hackathons. If you have an idea, a collaboration or an opportunity to build something useful, I'd be glad to hear
              about it.
            </p>
            <p className="pt-2 font-serif text-[1rem] italic text-accent-ink">
              <a href="#projects" className="link-underline">↳ The work itself is in Nº 03.</a>
            </p>
          </div>

          <dl data-stagger className="border-t border-ink md:col-span-4 md:col-start-1 md:row-start-1" aria-label="Quick facts">
            {facts.map(({ label, value, sub }) => (
              <div key={label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-line py-4 md:grid-cols-1 md:gap-1 lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-4">
                <dt className="label pt-1">{label}</dt>
                <dd>
                  <span className="block font-serif text-[1.12rem] leading-snug">{value}</span>
                  <span className="mt-0.5 block text-[0.88rem] text-muted">{sub}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
