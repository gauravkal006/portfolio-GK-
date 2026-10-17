import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Maximize2 } from "lucide-react";
import { certifications, type Certificate } from "../data/experience";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { openCertificate } from "../lib/certViewer";
import { SectionHeading } from "./SectionHeading";

const spring = { type: "spring", stiffness: 240, damping: 22 } as const;

/**
 * One certificate: the scan in a paper frame with its title, issuer and date beneath. Hovering or
 * focusing enlarges it; clicking opens the full-size viewer.
 */
function CertificateCard({ cert, i }: { cert: Certificate; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: -48, rotateX: -55 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, transition: { ...spring, delay: 0.08 + i * 0.12 } }}
      exit={{ opacity: 0, y: -30, rotateX: -40, transition: { duration: 0.22, delay: i * 0.04 } }}
      style={{ transformOrigin: "top center", transformPerspective: 900 }}
      className="relative max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-start"
    >
      <motion.button
        type="button"
        onClick={(e) => openCertificate(cert, e.currentTarget)}
        whileHover={{ scale: 1.07, y: -8, zIndex: 20, transition: spring }}
        whileFocus={{ scale: 1.07, y: -8, zIndex: 20, transition: spring }}
        whileTap={{ scale: 1.03 }}
        aria-haspopup="dialog"
        className="cert-card group relative flex h-full w-full flex-col text-left"
      >
        <span className="cert-frame block overflow-hidden">
          <img
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            loading="lazy"
            decoding="async"
            className="aspect-[1.414] h-full w-full object-contain p-2"
          />
        </span>
        <span className="flex flex-1 flex-col px-2 pt-4 pb-2">
          <span className="font-serif text-[1.35rem] leading-tight">{cert.title}</span>
          <span className="mt-1 text-[0.95rem] text-muted">
            {cert.issuer}
            {cert.date && <> · {cert.date}</>}
          </span>
          {cert.detail && <span className="mt-2 text-[0.92rem] text-accent-ink">{cert.detail}</span>}
          <span className="mt-auto flex items-center gap-1.5 pt-4 text-[0.92rem] font-medium text-ink transition-colors group-hover:text-accent-ink">
            View full size <Maximize2 size={14} aria-hidden="true" />
          </span>
        </span>
      </motion.button>
    </motion.li>
  );
}

/**
 * Certificates, kept tidy behind one button. Pressing it drops the certificate cards down one
 * after another; hovering (or focusing) a card lifts and enlarges it.
 */
export function CertificatesSection() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  useSectionReveal(ref);

  return (
    <section ref={ref} id="certificates" aria-labelledby="certificates-title" className="relative py-14 md:py-20">
      <div className="container-page">
        <SectionHeading
          index="06"
          kicker="Certificates"
          aside={`${certifications.length} certificates`}
          id="certificates-title"
          title={
            <>
              Courses and <em className="text-accent">credentials</em>
            </>
          }
        />

        <div data-reveal>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="certificate-list"
            onClick={() => setOpen((v) => !v)}
            className="push push--primary"
          >
            <span aria-hidden="true" className="push__shadow" />
            <span aria-hidden="true" className="push__edge" />
            <span className="push__front">
              {open ? "Hide certificates" : "View certificates"}
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.85rem]">{certifications.length}</span>
              <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
            </span>
          </button>
        </div>

        <div id="certificate-list">
          <AnimatePresence>
            {open && (
              <motion.ul
                key="certs"
                className="swipe-row mt-10 grid gap-8 sm:grid-cols-2 max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-4 max-sm:gap-4 max-sm:overflow-x-auto max-sm:px-4 max-sm:py-4"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0, transition: { duration: 0.35, delay: 0.15 } }}
                style={{ overflow: "visible" }}
              >
                {certifications.map((cert, i) => (
                  <CertificateCard key={cert.title} cert={cert} i={i} />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
