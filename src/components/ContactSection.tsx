import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Send } from "lucide-react";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { CodingProfiles } from "./CodingProfiles";

type Fields = { name: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (f.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (f.message.trim().length < 10) e.message = "Please write a message of at least 10 characters.";
  return e;
}

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
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail size={18} aria-hidden="true" />, external: false },
    { label: "LinkedIn", value: "gaurav-k-137336237", href: profile.linkedin, icon: <LinkedInIcon size={17} />, external: true },
    { label: "GitHub", value: profile.githubUser, href: profile.github, icon: <GitHubIcon size={17} />, external: true },
  ];

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="panel overflow-hidden" data-reveal>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_0%_0%,rgb(94_224_255/0.09),transparent_60%),radial-gradient(40rem_24rem_at_100%_100%,rgb(157_140_255/0.07),transparent_60%)]" />
          <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:p-14">
            <div className="flex flex-col">
              <p className="kicker">07 / Contact</p>
              <h2 id="contact-title" className="mt-4 text-[clamp(2.2rem,5.5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
                Have something <span className="text-accent">in mind?</span>
              </h2>
              <p className="mt-5 max-w-md text-[1.02rem] text-muted">
                I'm always glad to talk about ideas, collaborations, internships and opportunities to build something useful.
              </p>

              <ul className="mt-9 space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-xl border border-line bg-white/[0.02] p-3.5 transition-colors hover:border-accent/40 hover:bg-accent/[0.04]"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors group-hover:text-accent">{l.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-xs text-subtle">{l.label}</span>
                        <span className="block truncate text-[0.95rem] text-ink">{l.value}</span>
                      </span>
                      <ArrowUpRight size={16} className="ml-auto shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" aria-hidden="true" />
                      {l.external && <span className="sr-only">(opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <p className="mb-2.5 font-mono text-[0.7rem] tracking-[0.08em] text-subtle uppercase">Coding profiles</p>
                <CodingProfiles />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <button type="button" onClick={copyEmail} className="inline-flex min-h-10 items-center gap-2 transition-colors hover:text-ink">
                  {copied ? <Check size={15} className="text-lime" aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  {copied ? "Email copied" : "Copy email address"}
                </button>
                <span className="inline-flex items-center gap-2"><MapPin size={15} aria-hidden="true" /> {profile.location}, India</span>
                <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
              </div>
            </div>

            <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-bg/60 p-5 backdrop-blur-sm sm:p-7" aria-describedby="contact-form-note">
              <h3 className="font-display text-lg font-semibold">Write me a message</h3>
              <p id="contact-form-note" className="mt-1 text-sm text-muted">
                This drafts an email in your mail app, addressed to me. Nothing is sent until you press send there.
              </p>

              <div className="mt-6 space-y-4">
                <Field id="contact-name" label="Your name" error={errors.name}>
                  <input id="contact-name" className="field" autoComplete="name" value={fields.name} onChange={update("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} />
                </Field>
                <Field id="contact-subject" label="Subject" error={errors.subject}>
                  <input id="contact-subject" className="field" value={fields.subject} onChange={update("subject")} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "contact-subject-error" : undefined} />
                </Field>
                <Field id="contact-message" label="Message" error={errors.message}>
                  <textarea id="contact-message" rows={5} className="field resize-y" value={fields.message} onChange={update("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} />
                </Field>
              </div>

              <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
                <Send size={16} aria-hidden="true" /> Open in my email app
              </button>
              <p role="status" className="mt-4 text-sm text-muted empty:hidden">
                {opened && (
                  <>
                    Your email app should now have the message ready. If nothing opened, email me directly at{" "}
                    <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">{profile.email}</a>.
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/90">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}
