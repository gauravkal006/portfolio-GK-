import { useRef } from "react";
import { BookOpen, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { CodeCard } from "./CodeCard";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { spotlightMove } from "../lib/spotlight";
import { SectionHeading } from "./SectionHeading";

const facts = [
  { icon: GraduationCap, label: "Studying", value: "B.Tech, Computer Science Engineering", sub: "PRMITR, Amravati · CGPA 8.1" },
  { icon: BookOpen, label: "Before that", value: "Diploma in Information Technology", sub: "Government Polytechnic, Amravati · 88.84%" },
  { icon: Sparkles, label: "Recently built", value: "Validify & DocBlendAI", sub: "Azure-backed verification and document QA" },
  { icon: MapPin, label: "Based in", value: "Amravati, Maharashtra", sub: "India" },
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
          id="about-title"
          title={<>Curious by nature.<br className="hidden sm:block" /> <span className="text-muted">Builder by choice.</span></>}
        />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div data-reveal className="order-last lg:order-none">
            <CodeCard />
          </div>

          <div data-reveal className="space-y-5 text-[1.05rem] leading-[1.8] text-muted">
            <p>
              I'm <strong className="font-medium text-ink">Gaurav</strong>, a Computer Science Engineering student at Prof. Ram Meghe
              Institute of Technology and Research, coming in after a Diploma in Information Technology. I'm interested in software
              development, AI/ML and problem-solving.
            </p>
            <p>
              I enjoy building practical projects that bring AI, web technologies and databases together, from a Google Drive-style
              storage app to a question-answering assistant that can read handwritten notes. Lately that has meant{" "}
              <strong className="font-medium text-ink">document intelligence</strong>,{" "}
              <strong className="font-medium text-ink">secure cloud backends</strong> and{" "}
              <strong className="font-medium text-ink">full-stack Java</strong>.
            </p>
            <p>
              I've also spent time as a Java full-stack intern at Compilers Technologies and building prototypes at 24-hour hackathons.
              I'm always glad to talk about ideas, collaborations and opportunities to build something useful.
            </p>
          </div>
        </div>

        <ul data-stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Quick facts">
          {facts.map(({ icon: Icon, label, value, sub }) => (
            <li key={label} onPointerMove={spotlightMove} className="panel spotlight p-5 transition-colors hover:border-line-strong">
              <Icon size={18} className="text-accent" aria-hidden="true" />
              <p className="mt-4 font-mono text-[0.7rem] tracking-[0.08em] text-subtle uppercase">{label}</p>
              <p className="mt-1 font-display text-[1.05rem] leading-snug font-medium text-ink">{value}</p>
              <p className="mt-1.5 text-sm text-muted">{sub}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
