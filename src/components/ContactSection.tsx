import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { CodingProfiles } from "./CodingProfiles";
import { Sunburst } from "./Motif";

type Fields = { name: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (f.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (f.message.trim().length < 10) e.message = "Please write a message of at least 10 characters.";
  return e;
}

/** The closing section, printed in reverse like the back cover of a magazine (a translucent night panel in the galaxy theme). */
export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [fields, setFields] = useState<Fields>({ name: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  useSectionReveal(ref);

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  // There is no backend: the form drafts an email in the visitor's own mail app.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    const body = `${fields.message.trim()}\n\n— ${fields.name.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(fields.subject.trim())}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "LinkedIn", value: "in/gaurav-k-137336237", href: profile.linkedin },
    { label: "GitHub", value: `@${profile.githubUser}`, href: profile.github },
  ];

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-cover pt-20 pb-16 text-cover-ink md:pt-28">
      <Sunburst rays={28} core={false} className="pointer-events-none absolute -top-40 -right-40 size-[30rem] text-mustard opacity-[0.16] md:-top-48 md:-right-24 md:size-[40rem]" />

      <div className="container-page relative">
        <div className="relative flex items-baseline gap-4 pt-3">
          <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-cover-ink" />
          <span className="font-mono text-[0.84rem] font-medium text-accent-inv">Nº 07</span>
          <span className="label !text-cover-ink/70">Contact</span>
          <span className="label ml-auto hidden !text-cover-ink/70 sm:block">{profile.location}, India</span>
        </div>

        <h2 id="contact-title" data-reveal className="display mt-10 max-w-[12ch] text-[clamp(3rem,9vw,7.5rem)] leading-[0.92]">
          Have something <em className="text-accent-inv">in mind?</em>
        </h2>

        <div className="mt-14 grid gap-16 md:grid-cols-12 md:gap-6">
          <div data-reveal className="md:col-span-6">
            <p className="max-w-md text-[1.08rem] text-cover-ink/75">
              I'm always glad to talk about ideas, collaborations, internships and opportunities to build something useful. Email is
              the quickest way to reach me.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="group mt-8 inline-flex max-w-full items-baseline gap-3 font-serif text-[clamp(1.5rem,4.2vw,2.6rem)] leading-tight break-all underline decoration-accent-inv decoration-1 underline-offset-[0.2em] transition-colors hover:text-accent-inv sm:break-normal"
            >
              {profile.email}
              <ArrowUpRight aria-hidden="true" className="size-[0.7em] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <div className="mt-3">
              <button type="button" onClick={copyEmail} className="inline-flex min-h-11 items-center gap-2 text-[0.9rem] text-cover-ink/70 transition-colors hover:text-cover-ink">
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copied ? "Email copied" : "Copy email address"}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
            </div>

            <ul className="mt-10 max-w-md border-t border-cover-ink/30">
              {links.map((l) => (
                <li key={l.label} className="border-b border-cover-ink/30">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center gap-4 py-3">
                    <span className="label w-20 !text-cover-ink/60">{l.label}</span>
                    <span className="transition-colors group-hover:text-accent-inv">{l.value}</span>
                    <ArrowUpRight size={16} aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <CodingProfiles />
          </div>

          <form noValidate onSubmit={onSubmit} className="md:col-span-5 md:col-start-8" aria-describedby="contact-form-note" data-reveal>
            <h3 className="font-serif text-[1.6rem] italic">Or write a short letter</h3>
            <p id="contact-form-note" className="mt-1 text-[0.9rem] text-cover-ink/70">
              This drafts an email in your mail app, addressed to me. Nothing is sent until you press send there.
            </p>

            <div className="mt-6 space-y-6">
              <Field id="contact-name" label="Your name" error={errors.name}>
                <input id="contact-name" className="field" autoComplete="name" value={fields.name} onChange={update("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} />
              </Field>
              <Field id="contact-subject" label="Subject" error={errors.subject}>
                <input id="contact-subject" className="field" value={fields.subject} onChange={update("subject")} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "contact-subject-error" : undefined} />
              </Field>
              <Field id="contact-message" label="Message" error={errors.message}>
                <textarea id="contact-message" rows={4} className="field resize-y" value={fields.message} onChange={update("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} />
              </Field>
            </div>

            <button type="submit" className="push push--primary mt-9 !block w-full sm:!inline-block sm:w-auto [&>.push__front]:justify-center">
              <span aria-hidden="true" className="push__shadow" />
              <span aria-hidden="true" className="push__edge" />
              <span className="push__front">
                Open in my email app <ArrowRight size={17} aria-hidden="true" className="arrow-r" />
              </span>
            </button>
            <p role="status" className="mt-4 text-[0.9rem] text-cover-ink/75 empty:hidden">
              {opened && (
                <>
                  Your email app should now have the message ready. If nothing opened, email me directly at{" "}
                  <a href={`mailto:${profile.email}`} className="text-accent-inv underline underline-offset-4">
                    {profile.email}
                  </a>
                  .
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label block !text-cover-ink/70">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.88rem] text-accent-inv">
          {error}
        </p>
      )}
    </div>
  );
}
