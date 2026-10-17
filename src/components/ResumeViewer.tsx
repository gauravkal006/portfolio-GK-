import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Download, FileText, X } from "lucide-react";
import { profile } from "../data/profile";
import { closeResume, useResumeOpen } from "../lib/resumeViewer";

/** Browsers that can render a PDF inside the page (desktop Chrome, Edge, Firefox, Safari). */
const canShowInline = () => {
  const nav = navigator as Navigator & { pdfViewerEnabled?: boolean };
  if (typeof nav.pdfViewerEnabled === "boolean") return nav.pdfViewerEnabled;
  return !window.matchMedia("(max-width: 767px)").matches;
};

/**
 * On-page résumé viewer: a rounded sheet that opens over the page instead of a new browser
 * tab. The PDF is embedded with the browser's own toolbar hidden where supported. Devices that
 * cannot show PDFs inline get Open and Download actions instead.
 */
export function ResumeViewer() {
  const open = useResumeOpen();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inline = typeof navigator !== "undefined" && canShowInline();

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return closeResume();
      if (event.key !== "Tab" || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a[href], button, iframe"));
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
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="resume-backdrop"
            aria-hidden="true"
            onClick={closeResume}
            className="fixed inset-0 z-[95] bg-[rgb(12_11_10/0.55)] backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div key="resume-sheet" className="pointer-events-none fixed inset-0 z-[96] grid place-items-center p-3 sm:p-6">
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="resume-viewer-title"
              className="resume-sheet pointer-events-auto grid w-[min(900px,100%)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden"
              style={{ height: inline ? "min(92dvh, 1180px)" : "auto" }}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 28 } }}
              exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.2 } }}
            >
              <header className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
                <span aria-hidden="true" className="nav-coin !size-9 !text-[0.9rem]">gk</span>
                <div className="min-w-0">
                  <h2 id="resume-viewer-title" className="truncate font-serif text-[1.15rem] leading-tight">{profile.name} · Résumé</h2>
                  <p className="label !text-[0.7rem]">PDF · 1 page</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <a
                    href={profile.resume}
                    download={profile.resumeFileName}
                    className="resume-tool"
                    aria-label="Download résumé"
                    title="Download"
                  >
                    <Download size={17} aria-hidden="true" />
                  </a>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-tool"
                    aria-label="Open résumé in a new tab"
                    title="Open in new tab"
                  >
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <button ref={closeRef} type="button" onClick={closeResume} className="resume-tool" aria-label="Close résumé">
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </header>

              {inline ? (
                <div className="relative overflow-hidden bg-paper-2 p-2 sm:p-3">
                  <iframe
                    src={`${profile.resume}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                    title={`${profile.name} résumé (PDF)`}
                    className="h-full w-full rounded-[12px] border-0 bg-white shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
                  <FileText size={40} aria-hidden="true" className="text-accent" />
                  <p className="max-w-xs text-muted">This device can't show the PDF inside the page. Open it in your PDF viewer or download it.</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="push push--primary push--sm">
                      <span aria-hidden="true" className="push__shadow" />
                      <span aria-hidden="true" className="push__edge" />
                      <span className="push__front">Open résumé</span>
                    </a>
                    <a href={profile.resume} download={profile.resumeFileName} className="push push--key push--sm">
                      <span aria-hidden="true" className="push__shadow" />
                      <span aria-hidden="true" className="push__edge" />
                      <span className="push__front">
                        Download <Download size={15} aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
