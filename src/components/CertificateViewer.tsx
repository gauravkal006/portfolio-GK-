import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { closeCertificate, useOpenCertificate } from "../lib/certViewer";
import { useSheet } from "../lib/sheet";

/** Full-size certificate view: a rounded sheet over a blurred page, closed with Escape or a click outside. */
export function CertificateViewer() {
  const cert = useOpenCertificate();
  const { phone, phoneMotion, handle, wrapClass, sheetClass } = useSheet(closeCertificate);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cert) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return closeCertificate();
      if (event.key !== "Tab" || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a[href], button"));
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
  }, [cert]);

  return (
    <AnimatePresence>
      {cert && (
        <>
          <motion.div
            key="cert-backdrop"
            aria-hidden="true"
            onClick={closeCertificate}
            className="fixed inset-0 z-[95] bg-[rgb(12_11_10/0.6)] backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div key="cert-sheet" className={`pointer-events-none fixed inset-0 z-[96] grid ${wrapClass}`}>
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-viewer-title"
              className={`resume-sheet pointer-events-auto flex max-h-[calc(100dvh-1.5rem)] w-[min(1100px,100%)] flex-col overflow-hidden sm:max-h-[calc(100dvh-3rem)] ${sheetClass}`}
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 28 } }}
              exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.2 } }}
              {...(phone ? phoneMotion : {})}
            >
              {handle}
              <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <h2 id="cert-viewer-title" className="truncate font-serif text-[1.2rem] leading-tight">{cert.title}</h2>
                  <p className="truncate text-[0.92rem] text-muted">
                    {cert.issuer}
                    {cert.date && <> · {cert.date}</>}
                  </p>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1">
                  <a href={cert.image} target="_blank" rel="noopener noreferrer" className="resume-tool" aria-label="Open certificate image in a new tab" title="Open in new tab">
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <button ref={closeRef} type="button" onClick={closeCertificate} className="resume-tool" aria-label="Close certificate">
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </header>
              <div className="min-h-0 flex-1 overflow-auto bg-paper-2 p-3 sm:p-5">
                <img
                  src={cert.image}
                  alt={`${cert.title} certificate from ${cert.issuer}`}
                  className="mx-auto block max-h-[calc(100dvh-10rem)] w-auto max-w-full rounded-[10px] bg-white object-contain shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)]"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
